import axios from 'axios';
import type {
  IScheduledMessage,
  IScheduleMessageRequest,
  ISendMessageRequest,
  ISlackChannel,
} from '@/types';

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class ApiService {
  // Auth endpoints
  async getSlackAuthUrl(): Promise<{ authUrl: string }> {
    const response = await api.get('/auth/slack');
    return response.data;
  }

  // Slack endpoints
  async getChannels(teamId: string): Promise<{ channels: ISlackChannel[] }> {
    const response = await api.get(`/slack/channels/${teamId}`);
    return response.data;
  }

  async sendMessage(
    data: ISendMessageRequest,
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/slack/send-message', data);
    return response.data;
  }

  async scheduleMessage(
    data: IScheduleMessageRequest,
  ): Promise<{ success: boolean; messageId: number; message: string }> {
    const response = await api.post('/slack/schedule-message', data);
    return response.data;
  }

  async getScheduledMessages(
    teamId: string,
  ): Promise<{ messages: IScheduledMessage[] }> {
    const response = await api.get(`/slack/scheduled-messages/${teamId}`);
    return response.data;
  }

  async cancelScheduledMessage(
    messageId: number,
    teamId: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(
      `/slack/scheduled-messages/${messageId}`,
      {
        data: { teamId },
      },
    );
    return response.data;
  }
}

export default new ApiService();
