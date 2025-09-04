export const APP_CONSTANTS = {
  STORAGE_KEYS: {
    CONNECTED_SLACK_TEAM: 'connected_slack_team',
  },
  POPUP_DIMENSIONS: {
    WIDTH: 600,
    HEIGHT: 700,
    FEATURES: 'width=600,height=700,scrollbars=yes,resizable=yes',
  },
  MESSAGE_TYPES: {
    SLACK_OAUTH_SUCCESS: 'SLACK_OAUTH_SUCCESS',
    SLACK_OAUTH_ERROR: 'SLACK_OAUTH_ERROR',
  },
  SUCCESS_MESSAGE_TIMEOUT: 3000,
  POPUP_CHECK_INTERVAL: 1000,
} as const;
