import mysql from 'mysql2/promise';

const isProduction = process.env.NODE_ENV === 'production';

const config = {
    host: isProduction ? process.env.PROD_MYSQL_HOST : process.env.DEV_MYSQL_HOST,
    user: isProduction ? process.env.PROD_MYSQL_USERNAME : process.env.DEV_MYSQL_USERNAME,
    password: isProduction ? process.env.PROD_MYSQL_PASSWORD : process.env.DEV_MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    multipleStatements: true,
};

export const pool = mysql.createPool({
    ...config,
    database: isProduction ? process.env.PROD_MYSQL_DATABASE : process.env.DEV_MYSQL_DATABASE,
});

export const pool_chat = mysql.createPool({
    ...config,
    database: isProduction ? process.env.PROD_MYSQL_DATABASE_CHAT : process.env.DEV_MYSQL_DATABASE_CHAT,
});

export const pool_auth = mysql.createPool({
    ...config,
    database: isProduction ? process.env.PROD_MYSQL_DATABASE_AUTH : process.env.DEV_MYSQL_DATABASE_AUTH,
});
