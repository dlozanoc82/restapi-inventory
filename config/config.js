import dotenv from "dotenv";
dotenv.config();

export const config = {
    app: {
        port: process.env.PORT || 4000
    },
    mysql: {
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_DB || 'ejemplo',
    },
    jwt:{
        secret: process.env.JWT_SECRET || 'notasecreta',
        refreshSecret : process.env.JWT_REFRESH || 'notasecreta2'
    }
}