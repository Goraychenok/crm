import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prismaService: PrismaService) {}
  create(createProjectDto: CreateProjectDto) {
    return this.prismaService.project.create({
      data: createProjectDto,
    });
  }

  findAll() {
    return this.prismaService.project.findMany();
  }

  findOne(id: number) {
    const project = this.prismaService.project.findUnique({
      where: {
        id: id,
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.prismaService.project.update({
      where: {
        id: id,
      },
      data: updateProjectDto,
    });
  }

  remove(id: number) {
    return this.prismaService.project.delete({
      where: {
        id: id,
      },
    });
  }
}
