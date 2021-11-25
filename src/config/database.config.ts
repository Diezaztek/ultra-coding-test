export default () => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'ultra',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    entities: [
        "dist/**/*.entity{.ts,.js}"
    ],
    synchronize: process.env.DB_SYNCHRONIZE || false,
    migrations: [
        "dist/src/migrations/*{.ts,.js}"
    ],
    cli: {
        migrationsDir: "src/migrations"
    }
});
