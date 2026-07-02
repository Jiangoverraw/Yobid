import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { TrashRestoreService } from './trash-restore.service';
import { TrashDeleteService } from './trash-delete.service';

@Injectable()
export class TrashService {
  constructor(
    private prisma: PrismaService,
    private restoreService: TrashRestoreService,
    private deleteService: TrashDeleteService,
  ) {}

  /** List all soft-deleted items visible to the user */
  async findAll(userId: number, userRole: Role) {
    const isSysAdmin = userRole === Role.ADMIN;

    // 1. Fetch soft-deleted Workspaces
    const workspaceWhere: any = { isDeleted: true };
    if (!isSysAdmin) {
      workspaceWhere.deletedById = userId;
    }
    const workspaces = await this.prisma.workspace.findMany({
      where: workspaceWhere,
      select: {
        id: true,
        name: true,
        deletedAt: true,
        ownerId: true,
      },
    });

    // 2. Fetch soft-deleted Projects (whose workspaces are NOT deleted)
    const projectWhere: any = {
      isDeleted: true,
      workspace: { isDeleted: false },
    };
    if (!isSysAdmin) {
      projectWhere.deletedById = userId;
    }
    const projects = await this.prisma.project.findMany({
      where: projectWhere,
      select: {
        id: true,
        name: true,
        deletedAt: true,
        workspaceId: true,
        workspace: { select: { name: true } },
      },
    });

    // 3. Fetch soft-deleted Tasks (whose projects and workspaces are NOT deleted)
    const taskWhere: any = {
      isDeleted: true,
      project: {
        isDeleted: false,
        workspace: { isDeleted: false },
      },
    };
    if (!isSysAdmin) {
      taskWhere.deletedById = userId;
    }
    const tasks = await this.prisma.task.findMany({
      where: taskWhere,
      select: {
        id: true,
        title: true,
        deletedAt: true,
        projectId: true,
        project: {
          select: {
            name: true,
            workspace: { select: { name: true } },
          },
        },
        creatorId: true,
        assigneeId: true,
      },
    });

    // 4. Map & Combine results
    const mappedWorkspaces = workspaces.map((w) => ({
      id: w.id,
      type: 'workspace',
      name: w.name,
      deletedAt: w.deletedAt,
      workspaceName: '',
      projectName: '',
    }));

    const mappedProjects = projects.map((p) => ({
      id: p.id,
      type: 'project',
      name: p.name,
      deletedAt: p.deletedAt,
      workspaceName: p.workspace?.name || '',
      projectName: '',
    }));

    const mappedTasks = tasks.map((t) => ({
      id: t.id,
      type: 'task',
      name: t.title,
      deletedAt: t.deletedAt,
      workspaceName: t.project?.workspace?.name || '',
      projectName: t.project?.name || '',
    }));

    const allTrashItems = [
      ...mappedWorkspaces,
      ...mappedProjects,
      ...mappedTasks,
    ];

    // Sort by deletedAt desc
    return allTrashItems.sort((a, b) => {
      const dateA = a.deletedAt ? new Date(a.deletedAt).getTime() : 0;
      const dateB = b.deletedAt ? new Date(b.deletedAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  /** Restore a soft-deleted item */
  restore(type: string, id: number, userId: number, userRole: Role) {
    return this.restoreService.restore(type, id, userId, userRole);
  }

  /** Permanently delete an item */
  permanentDelete(type: string, id: number, userId: number, userRole: Role) {
    return this.deleteService.permanentDelete(type, id, userId, userRole);
  }

  /** Permanently delete ALL trash items visible to the user */
  clearAll(userId: number, userRole: Role) {
    return this.deleteService.clearAll(userId, userRole);
  }
}
