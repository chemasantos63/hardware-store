
export const {
    APP_PORT = 4000,
    NODE_ENV = "development",
    DB_USERNAME = "adminDb",
    DB_PASSWORD = "qwe369*",
    DB_HOST = "cluster0-0jrvj.mongodb.net",
    DB_PORT = "27017",
    DB_NAME = "hardware-store"
} = process.env

export const IN_PROD = NODE_ENV !== "production"