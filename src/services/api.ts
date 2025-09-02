import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SlackTeam {
  id: string;
  name: string;
}

export interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
}

export interface ScheduledMessage {
  id: number;
  team_id: string;
  channel_id: string;
  channel_name: string;
  message: string;
  scheduled_time: number;
  status: string;
  created_at: string;
}

export interface SendMessageRequest {
  teamId: string;
  channelId: string;
  message: string;
}

export interface ScheduleMessageRequest {
  teamId: string;
  channelId: string;
  channelName: string;
  message: string;
  scheduledTime: string;
}

class ApiService {
  // Auth endpoints
  async getSlackAuthUrl(): Promise<{ authUrl: string }> {
    const response = await api.get('/auth/slack');
    return response.data;
  }

  // Slack endpoints
  async getChannels(teamId: string): Promise<{ channels: SlackChannel[] }> {
    const response = await api.get(`/slack/channels/${teamId}`);
    return response.data;
  }

  async sendMessage(data: SendMessageRequest): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/slack/send-message', data);
    return response.data;
  }

  async scheduleMessage(data: ScheduleMessageRequest): Promise<{ success: boolean; messageId: number; message: string }> {
    const response = await api.post('/slack/schedule-message', data);
    return response.data;
  }

  async getScheduledMessages(teamId: string): Promise<{ messages: ScheduledMessage[] }> {
    const response = await api.get(`/slack/scheduled-messages/${teamId}`);
    return response.data;
  }

  async cancelScheduledMessage(messageId: number, teamId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/slack/scheduled-messages/${messageId}`, {
      data: { teamId }
    });
    return response.data;
  }
}

export default new ApiService();