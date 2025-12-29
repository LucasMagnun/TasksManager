import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TasksService {
  constructor(
    @Inject('RABBITMQ_SERVICE')
    private readonly client: ClientProxy,
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async create(userId: string, dto: CreateTaskDto) {
    const task = this.taskRepo.create({
      ...dto,
      createdBy: userId,
    });

    await this.taskRepo.save(task);

    this.client.emit('task.created', {
      taskId: task.id,
      userId,
      title: task.title,
    });

    return task;
  }

  findAll() {
    return this.taskRepo.find({ relations: ['comments'] });
  }
}
