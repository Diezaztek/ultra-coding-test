import databaseConfig from './database.config';
import redisConfig from './redis.config';
import tasksConfig from './tasks.config';
export default () => ({
  environment: process.env.NODE_ENV ? process.env.NODE_ENV : 'dev',
  database: {
    ...databaseConfig(),
  },
  redis: {
    ...redisConfig(),
  },
  tasks: {
    ...tasksConfig(),
  },
});
