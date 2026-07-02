import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksSubtasksService } from './tasks-subtasks.service';
import { TasksCommentsService } from './tasks-comments.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  providers: [TasksService, TasksSubtasksService, TasksCommentsService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
