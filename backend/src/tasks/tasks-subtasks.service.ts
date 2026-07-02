import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { assertProjectAccess, assertProjectManager } from './tasks-auth';

@Injectable()
export class TasksSubtasksService {
  constructor(private prisma: PrismaService) {}

  async createSubtask(
    taskId: number,
    data: { title: string; assigneeId?: number },
    userId: number,
    userRole: Role,
  ) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Task ${taskId} not found`);

    await assertProjectManager(this.prisma, task.projectId, userId, userRole);

    return this.prisma.subtask.create({
      data: { taskId, title: data.title, assigneeId: data.assigneeId },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async updateSubtask(
    subtaskId: number,
    data: { title?: string; isCompleted?: boolean; assigneeId?: number },
    userId: number,
    userRole: Role,
  ) {
    const subtask = await this.prisma.subtask.findUnique({
      where: { id: subtaskId },
      include: { task: true },
    });
    if (!subtask) throw new NotFoundException(`Subtask ${subtaskId} not found`);

    await assertProjectAccess(this.prisma, subtask.task.projectId, userId, userRole);

    return this.prisma.subtask.update({
      where: { id: subtaskId },
      data,
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async deleteSubtask(subtaskId: number, userId: number, userRole: Role) {
    const subtask = await this.prisma.subtask.findUnique({
      where: { id: subtaskId },
      include: { task: true },
    });
    if (!subtask) throw new NotFoundException(`Subtask ${subtaskId} not found`);

    await assertProjectManager(this.prisma, subtask.task.projectId, userId, userRole);

    await this.prisma.subtask.delete({ where: { id: subtaskId } });
    return { message: 'Subtask deleted' };
  }
}
