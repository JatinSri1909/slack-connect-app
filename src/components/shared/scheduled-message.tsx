import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import apiService from '@/services/api';
import type { IScheduledMessage, IScheduledMessagesProps } from '@/types';

const ScheduledMessages = (props : IScheduledMessagesProps) => {
  const { teamId, refreshTrigger } = props;
  const [messages, setMessages] = useState<IScheduledMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    const loadScheduledMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const { messages } = await apiService.getScheduledMessages(teamId);
        setMessages(messages);
      } catch (error) {
        console.error('Error loading scheduled messages:', error);
        setError('Failed to load scheduled messages');
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      loadScheduledMessages();
    }
  }, [teamId, refreshTrigger]);

  const handleCancelMessage = async (messageId: number) => {
    try {
      setCancellingId(messageId);
      await apiService.cancelScheduledMessage(messageId, teamId);
      
      // Remove the cancelled message from the list
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error cancelling message:', error);
      setError('Failed to cancel message');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'sent':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading scheduled messages...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 shadow-lg shadow-primary/5">
      <CardHeader>
        <CardTitle className="text-primary flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Scheduled Messages</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded">
            {error}
          </div>
        )}

        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No scheduled messages found
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge 
                        variant={getStatusVariant(message.status)}
                        className={message.status === 'pending' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                        }
                      >
                        {message.status}
                      </Badge>
                      <span className="text-sm text-primary font-medium">
                        #{message.channel_name}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-2 text-primary">{message.message}</p>
                    
                    <div className="text-xs text-muted-foreground">
                      Scheduled for: <span className="text-primary">{formatDateTime(message.scheduled_time.toString())}</span>
                    </div>
                  </div>

                  {message.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelMessage(message.id)}
                      disabled={cancellingId === message.id}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      {cancellingId === message.id ? 'Cancelling...' : 'Cancel'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduledMessages;
