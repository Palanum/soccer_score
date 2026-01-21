import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  API_FOOTBALL_KEY: process.env.API_FOOTBALL_KEY as string,
};
