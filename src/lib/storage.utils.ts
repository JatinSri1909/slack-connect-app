import { APP_CONSTANTS } from '@/constants';
import type { ISlackTeam } from '@/types';

export function getStoredTeam(): ISlackTeam | null {
  try {
    const storedTeam = localStorage.getItem(
      APP_CONSTANTS.STORAGE_KEYS.CONNECTED_SLACK_TEAM,
    );
    if (storedTeam) {
      return JSON.parse(storedTeam);
    }
  } catch (error) {
    console.error('Error parsing stored team data:', error);
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.CONNECTED_SLACK_TEAM);
  }
  return null;
}

export function storeTeam(team: ISlackTeam): void {
  localStorage.setItem(
    APP_CONSTANTS.STORAGE_KEYS.CONNECTED_SLACK_TEAM,
    JSON.stringify(team),
  );
}

export function removeStoredTeam(): void {
  localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.CONNECTED_SLACK_TEAM);
}
