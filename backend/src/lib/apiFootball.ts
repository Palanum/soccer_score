// backend/src/lib/apiFootball.ts
import axios, { AxiosInstance } from 'axios';

import cache from '../utils/cache';
import { APIResponse, Match, League } from '../types/football.types';
import { getSeason } from "../config/season";

const API_KEY = process.env.FOOTBALL_API_KEY || '';
const BASE_URL = 'https://v3.football.api-sports.io';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-apisports-key": API_KEY
  },
  timeout: 10000
});


/* ======================
   REQUEST LOG
====================== */
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ======================
   RESPONSE HANDLER
====================== */
apiClient.interceptors.response.use(
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


/* ====================================================
   🔥 LIVE MATCHES (SHORT CACHE - IMPORTANT)
==================================================== */
export async function getLiveMatches(): Promise<
  APIResponse<Match[]>
> {
  const cacheKey = 'live_matches';

  const cached = cache.get<APIResponse<Match[]>>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await apiClient.get<
      APIResponse<Match[]>
    >('/fixtures', {
      params: { live: 'all' },
    });

    const data = response.data;

    // IMPORTANT:
    // If no live matches, cache only briefly
    const ttl =
      data.results > 0 ? 30000 : 60000; // 30s if live, 60s if none

    cache.set(cacheKey, data, ttl);

    return data;
  } catch (error) {
    throw new Error('Failed to fetch live matches');
  }
}

/* ====================================================
   📅 FIXTURES BY DATE
==================================================== */
export async function getFixturesByDate(
  date: string
): Promise<APIResponse<Match[]>> {
  const cacheKey = `fixtures_${date}`;
  const cached = cache.get<APIResponse<Match[]>>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await apiClient.get<
      APIResponse<Match[]>
    >('/fixtures', {
      params: { date },
    });

    const data = response.data;

    // Fixtures don't change much
    cache.set(cacheKey, data, 10 * 60 * 1000); // 10 min

    return data;
  } catch (error) {
    throw new Error('Failed to fetch fixtures');
  }
}

/* ====================================================
   📆 FIXTURES DATE RANGE
==================================================== */
export async function getFixturesByDateRange(
  from: string,
  to: string
): Promise<APIResponse<Match[]>> {
  const cacheKey = `fixtures_${from}_${to}`;
  const cached = cache.get<APIResponse<Match[]>>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await apiClient.get<
      APIResponse<Match[]>
    >('/fixtures', {
      params: { from, to },
    });

    const data = response.data;

    cache.set(cacheKey, data, 10 * 60 * 1000); // 10 min

    return data;
  } catch (error) {
    throw new Error('Failed to fetch fixtures');
  }
}

/* ====================================================
   🏆 LEAGUES (RARELY CHANGES)
==================================================== */
export async function getLeagues(): Promise<
  APIResponse<League[]>
> {
  const cacheKey = 'leagues';
  const cached = cache.get<APIResponse<League[]>>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await apiClient.get<
      APIResponse<League[]>
    >('/leagues');

    const data = response.data;

    cache.set(cacheKey, data, 24 * 60 * 60 * 1000); // 24h

    return data;
  } catch (error) {
    throw new Error('Failed to fetch leagues');
  }
}

/* ====================================================
   🏟 FIXTURES BY LEAGUE
==================================================== */
export async function getFixturesByLeague(
  leagueId: number
): Promise<APIResponse<Match[]>> {
  const season = getSeason();

  const cacheKey = `fixtures_league_${leagueId}_${season}`;
  const cached = cache.get<APIResponse<Match[]>>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await apiClient.get<
      APIResponse<Match[]>
    >("/fixtures", {
      params: {
        league: leagueId,
        season,
      },
    });

    const data = response.data;

    cache.set(cacheKey, data, 60 * 60 * 1000);

    return data;
  } catch (error: any) {
    console.error("API ERROR:", error?.response?.data);
    throw new Error("Failed to fetch league fixtures");
  }
}