import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const getStatisticUsers = async () => {
  const { data } = await axios.get<any>(
    'https://aerokod.bitrix24.ru/rest/36/zkn8zguvoz3byxrr/task.item.list.json',
    {
      params: {
        order: {
          ID: 'asc',
        },
        filter: {
          GROUP_ID: '404',
        },
      },
    },
  );
  console.log(data);
};

async function main() {
  console.log('Start command');
  await getStatisticUsers();
  console.log('Stop command');
}

main().catch((e) => console.error(e));
