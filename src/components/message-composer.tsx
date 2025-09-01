import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import apiService, { type SlackChannel } from '../services/api';

interface MessageComposerProps {
  teamId: string;
  onMessageSent: () => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ teamId, onMessageSent }) => {
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadChannels();
  }, [teamId]);

  const loadChannels = async () => {
    try {
      const { channels } = await apiService.getChannels(teamId);
      setChannels(channels);
    } catch (error) {
      setError('Failed to load channels');
      console.error('Error loading channels:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChannel || !message.trim()) {
      setError('Please select a channel and enter a message');
      return;
    }

    if (isScheduled && scheduledDate <= new Date()) {
      setError('Scheduled time must be in the future');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const selectedChannelObj = channels.find(c => c.id === selectedChannel);
      
      if (isScheduled) {
        await apiService.scheduleMessage({
          teamId,
          channelId: selectedChannel,
          channelName: selectedChannelObj?.name || '',
          message,
          scheduledTime: scheduledDate.toISOString()
        });
        setSuccess('Message scheduled successfully!');
      } else {
        await apiService.sendMessage({
          teamId,
          channelId: selectedChannel,
          message
        });
        setSuccess('Message sent successfully!');
      }

      // Reset form
      setMessage('');
      setSelectedChannel('');
      setIsScheduled(false);
      setScheduledDate(new Date());
      onMessageSent();
      
    } catch (error) {
      setError('Failed to send message');
      console.error('Send error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // At least 1 minute in the future
    return now;
  };

  return (
    <div className="message-composer">
      <h3>Compose Message</h3>
      
      <form onSubmit={handleSubmit} className="composer-form">
        <div className="form-group">
          <label htmlFor="channel">Channel:</label>
          <select
            id="channel"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            required
          >
            <option value="">Select a channel</option>
            {channels.map(channel => (
              <option key={channel.id} value={channel.id}>
                #{channel.name} {channel.is_private ? '(private)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            rows={4}
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
            />
            Schedule for later
          </label>
        </div>

        {isScheduled && (
          <div className="form-group">
            <label>Schedule Date & Time:</label>
            <DatePicker
              selected={scheduledDate}
              onChange={(date: Date | null) => date && setScheduledDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={getMinDateTime()}
              className="date-picker"
            />
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Sending...' : (isScheduled ? 'Schedule Message' : 'Send Now')}
        </button>
      </form>
    </div>
  );
};

export default MessageComposer;