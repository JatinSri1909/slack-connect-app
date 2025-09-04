import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import apiService from '@/services/api';
import type { IMessageComposerProps, ISlackChannel } from '@/types';
import { MESSAGE_CONSTANTS, APP_CONSTANTS } from '@/constants';
import { validateMessageForm } from '@/lib';

export const MessageComposer = (props: IMessageComposerProps) => {
  const { teamId, onMessageSent } = props;
  const [channels, setChannels] = useState<ISlackChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        const { channels } = await apiService.getChannels(teamId);
        setChannels(channels);
      } catch (error) {
        setError(MESSAGE_CONSTANTS.ERROR.LOAD_CHANNELS_FAILED);
        console.error('Error loading channels:', error);
      }
    };

    if (teamId) {
      loadChannels();
    }
  }, [teamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateMessageForm(selectedChannel, message);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (isScheduled) {
        await apiService.scheduleMessage({
          teamId,
          channelId: selectedChannel,
          channelName:
            channels.find((c) => c.id === selectedChannel)?.name || '',
          message,
          scheduledTime: scheduledDate.toISOString(),
        });
        setSuccess(MESSAGE_CONSTANTS.SUCCESS.MESSAGE_SCHEDULED);
      } else {
        await apiService.sendMessage({
          teamId,
          channelId: selectedChannel,
          message,
        });
        setSuccess(MESSAGE_CONSTANTS.SUCCESS.MESSAGE_SENT);
      }

      // Reset form
      setMessage('');
      setSelectedChannel('');
      setIsScheduled(false);
      setScheduledDate(new Date());
      onMessageSent();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), APP_CONSTANTS.SUCCESS_MESSAGE_TIMEOUT);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(
        error instanceof Error
          ? error.message
          : MESSAGE_CONSTANTS.ERROR.SEND_MESSAGE_FAILED,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 shadow-lg shadow-primary/5">
      <CardHeader>
        <CardTitle className="text-primary flex items-center space-x-2 font-slack-headline">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span>Compose Message</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="error-message">{error}</div>}

        {success && (
          <div className="mb-4 p-3 text-sm bg-green-100 border border-green-300 text-green-800 rounded font-slack-body">
            {success}
          </div>
        )}

                 <form onSubmit={handleSubmit} className="space-y-4">
           {/* Channel Selection */}
           <div className="space-y-2">
             <div className="space-y-2">
               <Label
                 htmlFor="channel-select"
                 className="text-primary font-medium"
               >
                 Channel
               </Label>
               <div className="text-xs text-muted-foreground bg-blue-50 border border-blue-200 rounded-md p-2">
                 <span className="font-medium text-blue-800">Note:</span> Channels require manual invitation. 
                 Write <code className="bg-blue-100 px-1 rounded text-blue-900">@Slack-Connect Hi</code> to invite the bot to your private channel.
               </div>
             </div>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="border-primary/30 focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select a channel" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    <span className="text-primary">#</span>
                    {channel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-primary font-medium">
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="resize-none border-primary/30 focus:border-primary focus:ring-primary/20"
            />
          </div>

          {/* Scheduling Options */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="schedule-toggle"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
              className="rounded border-primary/30 text-primary focus:ring-primary"
              aria-label="Schedule message for later"
            />
            <Label htmlFor="schedule-toggle" className="text-sm text-primary">
              Schedule for later
            </Label>
          </div>

          {isScheduled && (
            <div className="space-y-2 p-4 border border-primary/20 rounded-lg bg-primary/5">
              <Label className="text-primary font-medium">
                Schedule Date & Time
              </Label>
              <DatePicker
                selected={scheduledDate}
                onChange={(date: Date | null) => date && setScheduledDate(date)}
                showTimeSelect
                minDate={new Date()}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full px-3 py-2 border border-primary/30 rounded-md text-sm focus:border-primary focus:ring-primary/20"
                placeholderText="Select date and time"
              />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !selectedChannel || !message.trim()}
            className="w-full shadow-lg shadow-primary/25"
          >
            {loading
              ? isScheduled
                ? MESSAGE_CONSTANTS.UI.SCHEDULING
                : MESSAGE_CONSTANTS.UI.SENDING
              : isScheduled
                ? 'Schedule Message'
                : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
