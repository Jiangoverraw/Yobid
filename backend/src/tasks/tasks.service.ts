import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, TaskStatus, Priority, ProjectRole } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { TasksSubtasksService } from './tasks-subtasks.service';
import { TasksCommentsService } from './tasks-comments.service';
import { assertProjectAccess, assertProjectManager } from './tasks-auth';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private subtasksService: TasksSubtasksService,
    private commentsService: TasksCommentsService,
  ) {}

  /** Create a task */
  async create(
    data: {
      title: string;
      description?: string;
      projectId: number;
      assigneeId?: number;
      priority?: Priority;
      deadline?: string;
      status?: TaskStatus;
    },
    userId: number,
    userRole: Role,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId, isDeleted: false, workspace: { isDeleted: false } },
    });
    if (!project) throw new NotFoundException(`Project ${data.projectId} not found`);

    await assertProjectManager(this.prisma, data.projectId, userId, userRole);

    // Get max position for the status column
    const maxPos = await this.prisma.task.aggregate({
      where: { projectId: data.projectId, status: data.status ?? TaskStatus.TODO, isDeleted: false },
      _max: { position: true },
    });

    const task = await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        assigneeId: data.assigneeId,
        priority: data.priority ?? Priority.MEDIUM,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        status: data.status ?? TaskStatus.TODO,
        creatorId: userId,
        position: (maxPos._max.position ?? -1) + 1,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        creator: { select: { id: true, name: true, email: true } },
        _count: { select: { subtasks: true, comments: true } },
      },
    });

    // Notify assignee
    if (data.assigneeId && data.assigneeId !== userId) {
      await this.notificationsService.create({
        userId: data.assigneeId,
        title: 'New Task Assigned',
        message: `You have been assigned to task: "${task.title}"`,
        type: 'INFO',
        link: `/projects/${data.projectId}/tasks/${task.id}`,
      });
    }

    return task;
  }

  /** List tasks in a project, optionally filtered by status */
  async findAll(
    projectId: number,
    userId: number,
    userRole: Role,
    filters?: { status?: TaskStatus; assigneeId?: number; priority?: Priority },
  ) {
    await assertProjectAccess(this.prisma, projectId, userId, userRole);

    const where: any = { projectId, isDeleted: false };
    if (filters?.status) where.status = filters.status;
    if (filters?.assigneeId) where.assigneeId = filters.assigneeId;
    if (filters?.priority) where.priority = filters.priority;

    return this.prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        creator: { select: { id: true, name: true } },
        _count: { select: { subtasks: true, comments: true } },
      },
      orderBy: [{ status: 'asc' }, { position: 'asc' }],
    });
  }

  /** Get a single task with full details */
  async findOne(id: number, userId: number, userRole: Role) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true, isDeleted: true, workspace: { select: { id: true, name: true, isDeleted: true } } } },
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        creator: { select: { id: true, name: true, email: true } },
        subtasks: {
          include: {
            assignee: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        comments: {
          include: {
            author: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!task || task.isDeleted || task.project.isDeleted || task.project.workspace.isDeleted) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    await assertProjectAccess(this.prisma, task.projectId, userId, userRole);

    return task;
  }

  /** Update task (PROJECT_MANAGER can update everything, assignee can update status) */
  async update(
    id: number,
    data: {
      title?: string;
      description?: string;
      assigneeId?: number;
      priority?: Priority;
      deadline?: string;
      status?: TaskStatus;
      position?: number;
    },
    userId: number,
    userRole: Role,
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { project: { select: { isDeleted: true, workspace: { select: { isDeleted: true } } } } }
    });
    if (!task || task.isDeleted || task.project.isDeleted || task.project.workspace.isDeleted) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    // Check if user is a project manager
    const isManager =
      userRole === Role.ADMIN ||
      (await this.prisma.projectMember
        .findUnique({
          where: { projectId_userId: { projectId: task.projectId, userId } },
        })
        .then((m) => m?.role === ProjectRole.MANAGER));

    const isAssignee = task.assigneeId === userId;

    if (!isManager && !isAssignee) {
      throw new ForbiddenException('Only the task assignee or project manager can update this task');
    }

    // MEMBERs (assignees) can only update status
    if (!isManager && isAssignee) {
      const allowedKeys = new Set(['status']);
      const hasDisallowedKeys = Object.keys(data).some((k) => !allowedKeys.has(k));
      if (hasDisallowedKeys) {
        throw new ForbiddenException('Members can only update the task status');
      }
    }

    const oldAssigneeId = task.assigneeId;

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        creator: { select: { id: true, name: true } },
        _count: { select: { subtasks: true, comments: true } },
      },
    });

    // Notify new assignee if changed
    if (data.assigneeId && data.assigneeId !== oldAssigneeId && data.assigneeId !== userId) {
      await this.notificationsService.create({
        userId: data.assigneeId,
        title: 'Task Assigned to You',
        message: `You have been assigned to task: "${updated.title}"`,
        type: 'INFO',
        link: `/projects/${task.projectId}/tasks/${id}`,
      });
    }

    return updated;
  }

  /** Delete a task */
  async remove(id: number, userId: number, userRole: Role) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { project: { select: { isDeleted: true, workspace: { select: { isDeleted: true } } } } }
    });
    if (!task || task.isDeleted || task.project.isDeleted || task.project.workspace.isDeleted) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    await assertProjectAccess(this.prisma, task.projectId, userId, userRole);

    await this.prisma.task.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedById: userId,
      },
    });
    return { message: 'Task deleted successfully' };
  }

  // ─── Delegate Subtasks to TasksSubtasksService ─────────────────────────────

  createSubtask(taskId: number, data: { title: string; assigneeId?: number }, userId: number, userRole: Role) {
    return this.subtasksService.createSubtask(taskId, data, userId, userRole);
  }

  updateSubtask(subtaskId: number, data: { title?: string; isCompleted?: boolean; assigneeId?: number }, userId: number, userRole: Role) {
    return this.subtasksService.updateSubtask(subtaskId, data, userId, userRole);
  }

  deleteSubtask(subtaskId: number, userId: number, userRole: Role) {
    return this.subtasksService.deleteSubtask(subtaskId, userId, userRole);
  }

  // ─── Delegate Comments to TasksCommentsService ─────────────────────────────

  createComment(taskId: number, content: string, userId: number, userRole: Role) {
    return this.commentsService.createComment(taskId, content, userId, userRole);
  }

  updateComment(commentId: number, content: string, userId: number, userRole: Role) {
    return this.commentsService.updateComment(commentId, content, userId, userRole);
  }

  deleteComment(commentId: number, userId: number, userRole: Role) {
    return this.commentsService.deleteComment(commentId, userId, userRole);
  }
}
