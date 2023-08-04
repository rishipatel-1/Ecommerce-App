import dotenv from 'dotenv';
dotenv.config();

const config = {
  PORT: process.env.SERVER_PORT || 5000,
  SECRET_KEY_USER: process.env.SECRET_KEY_USER || "usersecret",
  DB_URI: process.env.DB_URI || "mongodb+srv://patelris2001:Rishi2001@cluster0.yvympgc.mongodb.net/ecommerce-app?retryWrites=true&w=majority"
 
};
export default config;
