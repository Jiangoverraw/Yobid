import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, ProjectRole } from '@prisma/client';

@Injectable()
export class TrashDeleteService {
  constructor(private prisma: PrismaService) {}

  async permanentDelete(type: string, id: number, userId: number, userRole: Role) {
    const isSysAdmin = userRole === Role.ADMIN;

    if (type === 'workspace') {
      const workspace = await this.prisma.workspace.findUnique({
        where: { id },
      });
      if (!workspace) throw new NotFoundException('Workspace not found');

      if (!isSysAdmin && workspace.ownerId !== userId && workspace.deletedById !== userId) {
        throw new ForbiddenException('Only the workspace owner, the person who deleted it, or ADMIN can permanently delete it');
      }

      await this.prisma.workspace.delete({ where: { id } });
      return { message: 'Workspace permanently deleted successfully' };
    }

    if (type === 'project') {
      const project = await this.prisma.project.findUnique({
        where: { id },
        include: { workspace: true },
      });
      if (!project) throw new NotFoundException('Project not found');

      if (!isSysAdmin && project.deletedById !== userId) {
        const workspaceOwner = project.workspace.ownerId === userId;
        const projectMember = await this.prisma.projectMember.findUnique({
          where: { projectId_userId: { projectId: id, userId } },
        });
        const isManager = projectMember?.role === ProjectRole.MANAGER;

        if (!workspaceOwner && !isManager) {
          throw new ForbiddenException('Only project managers, workspace owners, the person who deleted it, or ADMIN can permanently delete it');
        }
      }

      await this.prisma.project.delete({ where: { id } });
      return { message: 'Project permanently deleted successfully' };
    }

    if (type === 'task') {
      const task = await this.prisma.task.findUnique({
        where: { id },
      });
      if (!task) throw new NotFoundException('Task not found');

      if (!isSysAdmin && task.deletedById !== userId) {
        const isCreator = task.creatorId === userId;
        const projectMember = await this.prisma.projectMember.findUnique({
          where: { projectId_userId: { projectId: task.projectId, userId } },
        });
        const isManager = projectMember?.role === ProjectRole.MANAGER;

        if (!isCreator && !isManager) {
          throw new ForbiddenException('Only project managers, creator, the person who deleted it, or ADMIN can permanently delete it');
        }
      }

      await this.prisma.task.delete({ where: { id } });
      return { message: 'Task permanently deleted successfully' };
    }

    throw new BadRequestException(`Invalid type: ${type}`);
  }

  async clearAll(userId: number, userRole: Role): Promise<{ deleted: number }> {
    const isSysAdmin = userRole === Role.ADMIN;
    let totalDeleted = 0;

    // ── Tasks ──────────────────────────────────────────────────────────────
    const taskWhere: any = {
      isDeleted: true,
      project: { isDeleted: false, workspace: { isDeleted: false } },
    };
    if (!isSysAdmin) taskWhere.deletedById = userId;

    const tasks = await this.prisma.task.findMany({
      where: taskWhere,
      select: { id: true },
    });
    if (tasks.length > 0) {
      const taskIds = tasks.map((t) => t.id);
      const result = await this.prisma.task.deleteMany({
        where: { id: { in: taskIds } },
      });
      totalDeleted += result.count;
    }

    // ── Projects ───────────────────────────────────────────────────────────
    const projectWhere: any = {
      isDeleted: true,
      workspace: { isDeleted: false },
    };
    if (!isSysAdmin) projectWhere.deletedById = userId;

    const projects = await this.prisma.project.findMany({
      where: projectWhere,
      select: { id: true },
    });
    if (projects.length > 0) {
      const projectIds = projects.map((p) => p.id);
      const result = await this.prisma.project.deleteMany({
        where: { id: { in: projectIds } },
      });
      totalDeleted += result.count;
    }

    // ── Workspaces ─────────────────────────────────────────────────────────
    const workspaceWhere: any = { isDeleted: true };
    if (!isSysAdmin) workspaceWhere.deletedById = userId;

    const workspaces = await this.prisma.workspace.findMany({
      where: workspaceWhere,
      select: { id: true },
    });
    if (workspaces.length > 0) {
      const wsIds = workspaces.map((w) => w.id);
      const result = await this.prisma.workspace.deleteMany({
        where: { id: { in: wsIds } },
      });
      totalDeleted += result.count;
    }

    return { deleted: totalDeleted };
  }
}
