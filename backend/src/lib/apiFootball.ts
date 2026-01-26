import axios, { AxiosInstance } from 'axios';
import { ENV } from '../config/env';
import cache from '../utils/cache';
import { APIResponse, Match, League } from '../types/football.types';

const API_KEY = process.env.FOOTBALL_API_KEY || '';
const BASE_URL = 'https://v3.football.api-sports.io';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io'
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
   RESPONSE LOG
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

// Get live matches (cache 2 minutes during live games)
export async function getLiveMatches(): Promise<APIResponse<Match[]>> {
  const cacheKey = 'live_matches';
  const cached = cache.get<APIResponse<Match[]>>(cacheKey);
  
  if (cached) {
    console.log('✓ Returning cached live matches');
    return cached;
  }

  try {
    const response = await apiClient.get<APIResponse<Match[]>>('/fixtures', {
      params: { live: 'all' }
    });
    
    console.log(`✓ Fetched ${response.data.results} live matches from API`);
    cache.set(cacheKey, response.data, 120000); // 2 min cache
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch live matches');
  }
}

// Get fixtures by date (cache 10 minutes)
export async function getFixturesByDate(date: string): Promise<APIResponse<Match[]>> {
  const cacheKey = `fixtures_${date}`;
  const cached = cache.get<APIResponse<Match[]>>(cacheKey);
  
  if (cached) {
    console.log(`✓ Returning cached fixtures for ${date}`);
    return cached;
  }

  try {
    const response = await apiClient.get<APIResponse<Match[]>>('/fixtures', {
      params: { date }
    });
    
    console.log(`✓ Fetched ${response.data.results} fixtures for ${date} from API`);
    cache.set(cacheKey, response.data, 600000); // 10 min cache
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch fixtures');
  }
}

// Get fixtures by date range
export async function getFixturesByDateRange(
  from: string, 
  to: string
): Promise<APIResponse<Match[]>> {
  const cacheKey = `fixtures_${from}_${to}`;
  const cached = cache.get<APIResponse<Match[]>>(cacheKey);
  
  if (cached) {
    console.log(`✓ Returning cached fixtures for ${from} to ${to}`);
    return cached;
  }

  try {
    const response = await apiClient.get<APIResponse<Match[]>>('/fixtures', {
      params: { from, to }
    });
    
    console.log(`✓ Fetched ${response.data.results} fixtures from API`);
    cache.set(cacheKey, response.data, 600000); // 10 min cache
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch fixtures');
  }
}

// Get top leagues (cache 24 hours - rarely changes)
export async function getLeagues(): Promise<APIResponse<League[]>> {
  const cacheKey = 'leagues';
  const cached = cache.get<APIResponse<League[]>>(cacheKey);
  
  if (cached) {
    console.log('✓ Returning cached leagues');
    return cached;
  }

  try {
    const response = await apiClient.get<APIResponse<League[]>>('/leagues');
    
    console.log(`✓ Fetched ${response.data.results} leagues from API`);
    cache.set(cacheKey, response.data, 86400000); // 24 hour cache
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch leagues');
  }
}

// Get fixtures by league and season
export async function getFixturesByLeague(
  leagueId: number, 
  season: number
): Promise<APIResponse<Match[]>> {
  const cacheKey = `fixtures_league_${leagueId}_${season}`;
  const cached = cache.get<APIResponse<Match[]>>(cacheKey);
  
  if (cached) {
    console.log(`✓ Returning cached fixtures for league ${leagueId}`);
    return cached;
  }

  try {
    const response = await apiClient.get<APIResponse<Match[]>>('/fixtures', {
      params: { league: leagueId, season }
    });
    
    console.log(`✓ Fetched ${response.data.results} fixtures for league ${leagueId}`);
    cache.set(cacheKey, response.data, 3600000); // 1 hour cache
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch league fixtures');
  }
}