const dev = {
    username: process.env.DEV_MONGODB_USERNAME || 'trinhcuong297',
    password: process.env.DEV_MONGODB_PASSWORD || 'caocuong297',
}
const prod = {
    username: process.env.DEV_MONGODB_USERNAME || 'trinhcuong297',
    password: process.env.DEV_MONGODB_PASSWORD || 'caocuong297',
}


const config = { dev, prod }
const env = process.env.NODE_ENV || 'dev'

export const { username, password } = config[env]