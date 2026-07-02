import { Module } from '@nestjs/common';
import { TrashService } from './trash.service';
import { TrashRestoreService } from './trash-restore.service';
import { TrashDeleteService } from './trash-delete.service';
import { TrashController } from './trash.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TrashService, TrashRestoreService, TrashDeleteService],
  controllers: [TrashController],
})
export class TrashModule {}
