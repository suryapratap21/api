require("dotenv").config();

module.exports = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  database: process.env.DB_CONNECT,
  jwt: {
    secret: process.env.JWT_SECRET,
    tokenLife: process.env.TOKEN_LIFE,
  },
};
