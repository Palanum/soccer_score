import axios from 'axios';
import { ENV } from '../config/env';

export const apiFootball = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': ENV.API_FOOTBALL_KEY,
  },
});
