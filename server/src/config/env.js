require("dotenv").config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env variable: ${name}`);
  return value;
}

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: requireEnv("DATABASE_URL"),
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  SMTP_HOST: requireEnv("SMTP_HOST"),
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: requireEnv("SMTP_USER"),
  SMTP_PASS: requireEnv("SMTP_PASS"),
  EMAIL_FROM: process.env.EMAIL_FROM || "Xplore9ja <no-reply@xplore9ja.com>",

  CLOUDINARY_CLOUD_NAME: requireEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: requireEnv("CLOUDINARY_API_SECRET"),

  PAYSTACK_SECRET_KEY: requireEnv("PAYSTACK_SECRET_KEY"),
  PAYSTACK_BASE_URL: process.env.PAYSTACK_BASE_URL || "https://api.paystack.co"
};