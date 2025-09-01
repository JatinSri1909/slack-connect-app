import React, { useState, useEffect } from 'react';
import apiService, { type ScheduledMessage } from '../services/api';

interface ScheduledMessagesProps {
  teamId: string;
  refreshTrigger: number;
}

const ScheduledMessages: React.FC<ScheduledMessagesProps> = ({ teamId, refreshTrigger }) => {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    loadScheduledMessages();
  }, [teamId, refreshTrigger]);

  const loadScheduledMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const { messages } = await apiService.getScheduledMessages(teamId);
      setMessages(messages);
    } catch (error) {
      setError('Failed to load scheduled messages');
      console.error('Error loading scheduled messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelMessage = async (messageId: number) => {
    try {
      setCancellingId(messageId);
      await apiService.cancelScheduledMessage(messageId, teamId);
      
      // Remove the cancelled message from the list
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== messageId)
      );
      
    } catch (error) {
      setError('Failed to cancel message');
      console.error('Error cancelling message:', error);
    } finally {
      setCancellingId(null);
    }
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeUntilSend = (timestamp: number) => {
    const now = Date.now();
    const diff = timestamp - now;
    
    if (diff <= 0) return 'Sending soon...';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return 'in less than a minute';
    }
  };

  const truncateMessage = (message: string, maxLength: number = 100) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="scheduled-messages">
        <h3>Scheduled Messages</h3>
        <div className="loading">Loading scheduled messages...</div>
      </div>
    );
  }

  return (
    <div className="scheduled-messages">
      <div className="section-header">
        <h3>Scheduled Messages</h3>
        <button onClick={loadScheduledMessages} className="refresh-button">
          🔄 Refresh
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {messages.length === 0 ? (
        <div className="no-messages">
          <p>No scheduled messages found.</p>
          <p>Use the composer above to schedule your first message!</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((message) => (
            <div key={message.id} className="message-card">
              <div className="message-header">
                <div className="channel-info">
                  <span className="channel-name">#{message.channel_name}</span>
                  <span className="send-time">{formatDateTime(message.scheduled_time)}</span>
                </div>
                <div className="time-remaining">
                  {getTimeUntilSend(message.scheduled_time)}
                </div>
              </div>
              
              <div className="message-content">
                {truncateMessage(message.message)}
              </div>
              
              <div className="message-footer">
                <div className="message-meta">
                  <span className="created-at">
                    Created: {new Date(message.created_at).toLocaleDateString()}
                  </span>
                  <span className={`status status-${message.status}`}>
                    {message.status}
                  </span>
                </div>
                
                <button
                  onClick={() => handleCancelMessage(message.id)}
                  disabled={cancellingId === message.id}
                  className="cancel-button"
                >
                  {cancellingId === message.id ? 'Cancelling...' : 'Cancel'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledMessages;