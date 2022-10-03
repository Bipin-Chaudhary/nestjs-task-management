import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { v4 as uuid } from 'uuid';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    // @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    const query = this.tasksRepository.createQueryBuilder('task');
    return await query.getMany();
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    const result = await this.tasksRepository.findOne({ where: { id } });
    if (!result) throw new NotFoundException();
    return result;
  }

  async deleteTaskById(id: string): Promise<void> {
    const data = await this.tasksRepository.delete(id);
    console.log(data);
    return;
  }

  async updateStatus(id: string, status: string): Promise<Task> {
    const data = await this.getTaskById(id);

    data.status = TaskStatus[status];

    await this.tasksRepository.save(data);
    return data;
  }
}
