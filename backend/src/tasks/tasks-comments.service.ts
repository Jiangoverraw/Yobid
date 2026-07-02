import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, ProjectRole } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { assertProjectAccess } from './tasks-auth';

@Injectable()
export class TasksCommentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async createComment(
    taskId: number,
    content: string,
    userId: number,
    userRole: Role,
  ) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Task ${taskId} not found`);

    await assertProjectAccess(this.prisma, task.projectId, userId, userRole);

    const comment = await this.prisma.comment.create({
      data: { taskId, content, authorId: userId },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Notify task assignee if someone else commented
    if (task.assigneeId && task.assigneeId !== userId) {
      await this.notificationsService.create({
        userId: task.assigneeId,
        title: 'New Comment on Your Task',
        message: `Someone commented on "${task.title}"`,
        type: 'INFO',
        link: `/projects/${task.projectId}/tasks/${taskId}`,
      });
    }

    return comment;
  }

  async updateComment(
    commentId: number,
    content: string,
    userId: number,
    userRole: Role,
  ) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException(`Comment ${commentId} not found`);

    if (userRole !== Role.ADMIN && comment.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async deleteComment(commentId: number, userId: number, userRole: Role) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: { task: true },
    });
    if (!comment) throw new NotFoundException(`Comment ${commentId} not found`);

    const isManager =
      userRole === Role.ADMIN ||
      (await this.prisma.projectMember
        .findUnique({
          where: {
            projectId_userId: {
              projectId: comment.task.projectId,
              userId,
            },
          },
        })
        .then((m) => m?.role === ProjectRole.MANAGER));

    if (!isManager && comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.comment.delete({ where: { id: commentId } });
    return { message: 'Comment deleted' };
  }
}
