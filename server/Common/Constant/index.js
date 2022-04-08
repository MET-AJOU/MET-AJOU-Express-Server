import * as dotenv from 'dotenv';
dotenv.config();
export const corsOption = {
<<<<<<< HEAD
    // origin: `${process.env.WEB_SERVER_URL}`,
    origin: `${process.env.WEB_SERVER_URL}:${process.env.WEB_SERVER_PORT}`,
=======
  // origin: `${process.env.WEB_SERVER_URL}`,
  origin: `${process.env.WEB_SERVER_URL}:${process.env.WEB_SERVER_PORT}`,
>>>>>>> upstream/main
};