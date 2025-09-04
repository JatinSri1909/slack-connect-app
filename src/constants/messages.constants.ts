export const MESSAGE_CONSTANTS = {
  SUCCESS: {
    MESSAGE_SENT: 'Message sent successfully!',
    MESSAGE_SCHEDULED: 'Message scheduled successfully!',
  },
  ERROR: {
    AUTH_FAILED: 'Authentication failed',
    INIT_AUTH_FAILED: 'Failed to initialize authentication',
    LOAD_CHANNELS_FAILED: 'Failed to load channels',
    LOAD_SCHEDULED_MESSAGES_FAILED: 'Failed to load scheduled messages',
    SEND_MESSAGE_FAILED: 'Failed to send message',
    CANCEL_MESSAGE_FAILED: 'Failed to cancel message',
    PARSE_TEAM_DATA: 'Error parsing team data',
    INVALID_DATE: 'Invalid Date',
  },
  VALIDATION: {
    SELECT_CHANNEL_AND_MESSAGE: 'Please select a channel and enter a message',
  },
  UI: {
    CONNECTING: 'Connecting...',
    SENDING: 'Sending...',
    SCHEDULING: 'Scheduling...',
    CANCELLING: 'Cancelling...',
    LOADING_SCHEDULED_MESSAGES: 'Loading scheduled messages...',
    NO_SCHEDULED_MESSAGES: 'No scheduled messages found',
  },
} as const;
