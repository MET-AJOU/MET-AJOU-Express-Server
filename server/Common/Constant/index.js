import * as dotenv from 'dotenv';
dotenv.config();
const WEB_SERVER_URL = 'http://www.metajou.kro.kr/';
const WEB_SERVER_PORT = 80;
export const corsOption = {
  origin: `${WEB_SERVER_URL}:${WEB_SERVER_PORT}`,
  // origin: `${process.env.WEB_SERVER_URL}:${process.env.WEB_SERVER_PORT}`,
};
