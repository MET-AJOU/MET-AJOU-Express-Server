import * as dotenv from 'dotenv';
dotenv.config();
export const corsOption = {
  // origin: `${process.env.WEB_SERVER_URL}`,
  origin: `${process.env.WEB_SERVER_URL}:${process.env.WEB_SERVER_PORT}`,
};
