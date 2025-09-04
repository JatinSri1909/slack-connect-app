import { z } from 'zod';

// Zod schemas
export const SlackTeamSchema = z.object({
  id: z.string().min(1, 'Team ID is required'),
  name: z.string().min(1, 'Team name is required'),
});

export const SlackChannelSchema = z.object({
  id: z.string().min(1, 'Channel ID is required'),
  name: z.string().min(1, 'Channel name is required'),
  is_private: z.boolean(),
});

export const ScheduledMessageSchema = z.object({
  id: z.number().positive('ID must be positive'),
  team_id: z.string().min(1, 'Team ID is required'),
  channel_id: z.string().min(1, 'Channel ID is required'),
  channel_name: z.string().min(1, 'Channel name is required'),
  message: z.string().min(1, 'Message is required'),
  scheduled_time: z.number().positive('Scheduled time must be positive'),
  status: z.enum(['pending', 'sent', 'failed']),
  created_at: z.string().min(1, 'Created at is required'),
});

export const SendMessageRequestSchema = z.object({
  teamId: z.string().min(1, 'Team ID is required'),
  channelId: z.string().min(1, 'Channel ID is required'),
  message: z.string().min(1, 'Message is required'),
});

export const ScheduleMessageRequestSchema = z.object({
  teamId: z.string().min(1, 'Team ID is required'),
  channelId: z.string().min(1, 'Channel ID is required'),
  channelName: z.string().min(1, 'Channel name is required'),
  message: z.string().min(1, 'Message is required'),
  scheduledTime: z.string().min(1, 'Scheduled time is required'),
});

// TypeScript interfaces derived from Zod schemas
export interface IConnectSlackProps {
  onConnect: (team: { id: string; name: string }) => void;
}

export type ISlackTeam = z.infer<typeof SlackTeamSchema>;
export type ISlackChannel = z.infer<typeof SlackChannelSchema>;
export type IScheduledMessage = z.infer<typeof ScheduledMessageSchema>;
export type ISendMessageRequest = z.infer<typeof SendMessageRequestSchema>;
export type IScheduleMessageRequest = z.infer<
  typeof ScheduleMessageRequestSchema
>;

export interface IMessageComposerProps {
  teamId: string;
  onMessageSent: () => void;
}

export interface IScheduledMessagesProps {
  teamId: string;
  refreshTrigger: number;
}
