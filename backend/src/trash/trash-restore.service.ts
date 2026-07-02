import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, ProjectRole } from '@prisma/client';

@Injectable()
export class TrashRestoreService {
  constructor(private prisma: PrismaService) {}

  async restore(type: string, id: number, userId: number, userRole: Role) {
    const isSysAdmin = userRole === Role.ADMIN;

    if (type === 'workspace') {
      const workspace = await this.prisma.workspace.findUnique({
        where: { id },
      });
      if (!workspace) throw new NotFoundException('Workspace not found');
      if (!workspace.isDeleted) throw new BadRequestException('Workspace is not deleted');

      if (!isSysAdmin && workspace.ownerId !== userId && workspace.deletedById !== userId) {
        throw new ForbiddenException('Only the workspace owner, the person who deleted it, or ADMIN can restore it');
      }

      return this.prisma.workspace.update({
        where: { id },
        data: {
          isDeleted: false,
          deletedAt: null,
          deletedById: null,
          isActive: true,
        },
      });
    }

    if (type === 'project') {
      const project = await this.prisma.project.findUnique({
        where: { id },
        include: { workspace: true },
      });
      if (!project) throw new NotFoundException('Project not found');
      if (!project.isDeleted) throw new BadRequestException('Project is not deleted');

      if (project.workspace.isDeleted) {
        throw new BadRequestException('Cannot restore project because its parent workspace is deleted. Please restore the workspace first.');
      }

      if (!isSysAdmin && project.deletedById !== userId) {
        const workspaceOwner = project.workspace.ownerId === userId;
        const projectMember = await this.prisma.projectMember.findUnique({
          where: { projectId_userId: { projectId: id, userId } },
        });
        const isManager = projectMember?.role === ProjectRole.MANAGER;

        if (!workspaceOwner && !isManager) {
          throw new ForbiddenException('Only the person who deleted it, project managers, workspace owners, or ADMIN can restore it');
        }
      }

      return this.prisma.project.update({
        where: { id },
        data: {
          isDeleted: false,
          deletedAt: null,
          deletedById: null,
          isActive: true,
        },
      });
    }

    if (type === 'task') {
      const task = await this.prisma.task.findUnique({
        where: { id },
        include: {
          project: {
            include: { workspace: true },
          },
        },
      });
      if (!task) throw new NotFoundException('Task not found');
      if (!task.isDeleted) throw new BadRequestException('Task is not deleted');

      if (task.project.isDeleted) {
        throw new BadRequestException('Cannot restore task because its project is deleted. Please restore the project first.');
      }
      if (task.project.workspace.isDeleted) {
        throw new BadRequestException('Cannot restore task because its workspace is deleted. Please restore the workspace first.');
      }

      if (!isSysAdmin && task.deletedById !== userId) {
        const isCreator = task.creatorId === userId;
        const isAssignee = task.assigneeId === userId;
        const projectMember = await this.prisma.projectMember.findUnique({
          where: { projectId_userId: { projectId: task.projectId, userId } },
        });
        const isManager = projectMember?.role === ProjectRole.MANAGER;

        if (!isCreator && !isAssignee && !isManager) {
          throw new ForbiddenException('Only the person who deleted it, project managers, creator, assignee, or ADMIN can restore it');
        }
      }

      return this.prisma.task.update({
        where: { id },
        data: {
          isDeleted: false,
          deletedAt: null,
          deletedById: null,
        },
      });
    }

    throw new BadRequestException(`Invalid type: ${type}`);
  }
}
