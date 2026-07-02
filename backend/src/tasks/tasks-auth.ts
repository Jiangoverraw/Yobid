import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, ProjectRole } from '@prisma/client';

export async function assertProjectAccess(
  prisma: PrismaService,
  projectId: number,
  userId: number,
  userRole: Role,
) {
  if (userRole === Role.ADMIN) return;
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!member) {
    throw new ForbiddenException('You are not a member of this project');
  }
}

export async function assertProjectManager(
  prisma: PrismaService,
  projectId: number,
  userId: number,
  userRole: Role,
) {
  if (userRole === Role.ADMIN) return;
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!member || member.role !== ProjectRole.MANAGER) {
    throw new ForbiddenException('Only project managers or ADMIN can perform this action');
  }
}
