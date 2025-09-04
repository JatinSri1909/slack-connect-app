export interface IConnectSlackProps {
  onConnect: (team: { id: string; name: string }) => void;
}

export interface ISlackTeam {
  id: string;
  name: string;
}

export interface ISlackChannel {
  id: string;
  name: string;
  is_private: boolean;
}

export interface IScheduledMessage {
  id: number;
  team_id: string;
  channel_id: string;
  channel_name: string;
  message: string;
  scheduled_time: number;
  status: string;
  created_at: string;
}

export interface ISendMessageRequest {
  teamId: string;
  channelId: string;
  message: string;
}

export interface IScheduleMessageRequest {
  teamId: string;
  channelId: string;
  channelName: string;
  message: string;
  scheduledTime: string;
}

export interface IMessageComposerProps {
  teamId: string;
  onMessageSent: () => void;
}

export interface IScheduledMessagesProps {
  teamId: string;
  refreshTrigger: number;
}
