const dotenv = require('dotenv')
dotenv.config()

const {
  ENV: env,
  PORT: port,
  DATABASE_URL: databaseUrl,
  SECRET_KEY: secretKey,
  PASSWORD: password,
  PASSWORD_SUPER: passwordSuper,
} = process.env

const appUrl = 'https://localhost:3000'

console.log('database', databaseUrl)

module.exports = {
  appUrl,
  port,
  databaseUrl,
  secretKey,
  password,
  passwordSuper,
}
