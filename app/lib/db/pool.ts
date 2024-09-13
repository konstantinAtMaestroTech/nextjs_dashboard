import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
    host: process.env.DEV_MYSQL_HOST,
    user: process.env.DEV_MYSQL_USERNAME,
    database: process.env.DEV_MYSQL_DATABASE,
    password: process.env.DEV_MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    multipleStatements: true,
});

export const pool_chat = mysql.createPool({
    host: process.env.DEV_MYSQL_HOST,
    user: process.env.DEV_MYSQL_USERNAME,
    database: process.env.DEV_MYSQL_DATABASE_CHAT,
    password: process.env.DEV_MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    multipleStatements: true,
});

export const pool_auth = mysql.createPool({
    host: process.env.DEV_MYSQL_HOST,
    user: process.env.DEV_MYSQL_USERNAME,
    database: process.env.DEV_MYSQL_DATABASE_AUTH,
    password: process.env.DEV_MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    multipleStatements: true,
});
