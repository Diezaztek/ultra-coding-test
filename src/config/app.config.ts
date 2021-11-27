import databaseConfig from './database.config';
import redisConfig from './redis.config';
import tasksConfig from './tasks.config';
export default () => ({
    environment: (process.env.ENVIRONMENT) ? process.env.ENVIRONMENT : 'dev' ,
    database: {
        ...databaseConfig()
    },
    redis: {
        ...redisConfig()
    },
    tasks: {
        ...tasksConfig()
    }
});