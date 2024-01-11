import * as dotenv from 'dotenv';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';

dotenv.config();

class GetStatisticUsers {
  public addUser = 0;
  public updateUser = 0;
  private prisma = new PrismaClient();

  async getStatisticUsers() {
    let users = [];
    let page = 0;
    const { data } = await axios.get<any>(
      'https://aerokod.bitrix24.ru/rest/36/zkn8zguvoz3byxrr/user.search',
    );

    users = data.result;
    const total = data.total / 50;
    if (total > 1) {
      page = Math.ceil(total) - 1;
    }

    for (let i = 1; i <= page; i++) {
      const { data } = await axios.get(
        `https://aerokod.bitrix24.ru/rest/36/zkn8zguvoz3byxrr/user.search?start=${
          i * 50
        }`,
      );
      users = [...users, ...data.result];
    }

    if (users && users.length) await this.addedUsers(users);
  }
  async addedUsers(users: any[]) {
    users.forEach((n) => {
      if (n.ACTIVE) this.findUser(n);
    });
  }

  async findUser(bitrixUser: any) {
    const user = await this.prisma.user.findFirst({
      where: {
        bitrixId: +bitrixUser.ID,
      },
    });
    if (user === null) {
      await this.prisma.user.create({
        data: {
          email: bitrixUser.EMAIL,
          name: bitrixUser.NAME + ' ' + bitrixUser.LAST_NAME,
          password: await hash(faker.internet.password()),
          bitrixId: +bitrixUser.ID,
          phone: bitrixUser.PHONE,
        },
      });
      this.addUser = this.addUser + 1;
    } else {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: bitrixUser.NAME + ' ' + bitrixUser.LAST_NAME,
        },
      });
      this.updateUser = this.updateUser + 1;
    }
  }

  async getStatisticTask() {
    let tasks = [];
    let page = 0;
    const { data } = await axios.get(
      'https://aerokod.bitrix24.ru/rest/36/zkn8zguvoz3byxrr/tasks.task.list?filter[>%3DCREATED_DATE]=2023-11-01 00:00:00&select[]=ID&select[]=TIME_SPENT_IN_LOGS',
    );
    tasks = data.result.tasks;
    const total = data.total / 50;
    if (total > 1) {
      page = Math.ceil(total) - 1;
    }
    for (let i = 1; i <= page; i++) {
      const { data } = await axios.get(
        `https://aerokod.bitrix24.ru/rest/36/zkn8zguvoz3byxrr/tasks.task.list?filter[>%3DCREATED_DATE]=2023-11-01 00:00:00&select[]=ID&select[]=TIME_SPENT_IN_LOGS&start=${
          i * 50
        }`,
      );
      tasks = [...tasks, ...data.result.tasks];
    }
    await this.generateStatisticFromUsers(tasks);
  }

  async generateStatisticFromUsers(tasks: any[]) {
    const users = {};
    const delay = (delayInms) => {
      return new Promise((resolve) => setTimeout(resolve, delayInms));
    };
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].timeSpentInLogs && tasks[i].timeSpentInLogs !== null) {
        const { data } = await axios.get(
          `https://aerokod.bitrix24.ru/rest/36/zkn8zguvoz3byxrr/task.elapseditem.getlist?TASKID=${tasks[i].id}&ORDER[CREATED_DATE]=asc`,
        );
        if (data && data.result && data.result.length) {
          for (let b = 0; b < data.total; b++) {
            const user = await this.prisma.user.findFirst({
              where: {
                bitrixId: +data.result[b].USER_ID,
              },
            });
            if (
              user !== null &&
              new Date(data.result[b].DATE_STOP).getTime() >=
                new Date(2024, 0, 1).getTime()
            ) {
              if (users.hasOwnProperty(user.name)) {
                users[user.name] =
                  users[user.name] + Number(data.result[b].MINUTES);
              } else {
                users[user.name] = +data.result[b].MINUTES;
              }
            }
          }
        }
        await delay(300);
      }
    }

    console.log(users);
  }
}

async function main() {
  console.log('Start command');
  const command = new GetStatisticUsers();
  await command.getStatisticUsers();
  await command.getStatisticTask();

  console.log(`Добавлено ${command.addUser} сотрудников`);
  console.log(`Обновлено ${command.updateUser} сотрудников`);

  console.log('Stop command');
}

main().catch((e) => console.error(e));
