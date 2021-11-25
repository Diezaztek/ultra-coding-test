import databaseConfig from './database.config';
export default () => ({
    environment: (process.env.ENVIRONMENT) ? process.env.ENVIRONMENT : 'dev' ,
    database: {
        ...databaseConfig()
    }
});