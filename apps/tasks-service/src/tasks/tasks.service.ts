import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  create(userId: string, dto: CreateTaskDto) {
    const task = this.taskRepo.create({
      ...dto,
      createdBy: userId,
    });

    return this.taskRepo.save(task);
  }

  findAll() {
    return this.taskRepo.find({ relations: ['comments'] });
  }
}
