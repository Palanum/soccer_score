import axios from 'axios';
import { ENV } from '../config/env';

export const apiFootball = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': ENV.API_FOOTBALL_KEY,
  },
});
/* ======================
   REQUEST LOG
====================== */
apiFootball.interceptors.request.use(
  (config) => {
    console.log(
      `➡️ API-Football REQUEST: ${config.method?.toUpperCase()} ${config.url}`,
      config.params ? `params=${JSON.stringify(config.params)}` : ""
    );
    return config;
  },
  (error) => {
    console.error("❌ API-Football REQUEST ERROR:", error.message);
    return Promise.reject(error);
  }
);

/* ======================
   RESPONSE LOG
====================== */
apiFootball.interceptors.response.use(
  (response) => {
    console.log(
      `✅ API-Football RESPONSE: ${response.status} ${response.config.url}`
    );
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `❌ API-Football RESPONSE ERROR: ${error.response.status}`,
        error.response.data
      );
    } else {
      console.error("❌ API-Football NETWORK ERROR:", error.message);
    }

    return Promise.reject(error);
  }
);