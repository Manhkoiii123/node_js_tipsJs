"use strict";
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3052,
  },
  db: {
    name: process.env.DEV_DB_NAME || "shopDEV",
  },
};
const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    name: process.env.PRO_DB_NAME || "shopPRO",
  },
};
const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
