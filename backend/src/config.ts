
export const {
    APP_PORT = 4000,
    NODE_ENV = "development",
    DB_USERNAME = "adminDb",
    DB_PASSWORD = "qwe369*",
    DB_HOST = "cluster0-0jrvj.mongodb.net",
    DB_PORT = "27017",
    DB_NAME = "hardware-store",

    SESS_NAME = "sid",
    SESS_SECRET = "ssh!secret!",
    SESS_LIFETIME = 1000 * 60 * 60 * 2,

    REDIS_HOST = "redis-11468.c114.us-east-1-4.ec2.cloud.redislabs.com",
    REDIS_PORT = 11468,
    REDIS_PASSWORD = "eeWfwTlpYWvPDx6sHxOYlVUUrFSqN96d"
} = process.env

export const IN_PROD = NODE_ENV === "production"