module.exports = {
    development: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD_S || '',
        database: process.env.DB_NAME || 'CatalogDB',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
    },
    test: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD_S || '',
        database: process.env.DB_NAME || 'CatalogDB',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
    },
    production: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD_S || '',
        database: process.env.DB_NAME || 'CatalogDB',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
    },
};
