import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import apiService from '../services/api';

interface ConnectSlackProps {
  onConnect: (team: { id: string; name: string }) => void;
}

const ConnectSlack = ({ onConnect }: ConnectSlackProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { authUrl } = await apiService.getSlackAuthUrl();
      
      const popup = window.open(
        authUrl,
        'slack-oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          setLoading(false);
          
          const teamData = localStorage.getItem('connected_slack_team');
          if (teamData) {
            try {
              const team = JSON.parse(teamData);
              onConnect(team);
            } catch (error) {
              console.error('Error parsing team data:', error);
            }
          }
        }
      }, 1000);

      const messageListener = (event: MessageEvent) => {
        if (event.data.type === 'SLACK_OAUTH_SUCCESS') {
          popup?.close();
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          setLoading(false);
          onConnect(event.data.team);
        } else if (event.data.type === 'SLACK_OAUTH_ERROR') {
          popup?.close();
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          setError(event.data.error || 'Authentication failed');
          setLoading(false);
        }
      };

      window.addEventListener('message', messageListener);
      
    } catch (error) {
      console.error('Auth error:', error);
      setError('Failed to initialize authentication');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/25">
            <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
          </div>
          <CardTitle className="text-primary">Connect to Slack</CardTitle>
          <CardDescription>
            Connect your Slack workspace to start sending and scheduling messages
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded">
              {error}
            </div>
          )}

          <div className="space-y-3 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>Send messages to any channel</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>Schedule messages for later</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>Secure OAuth authentication</span>
            </div>
          </div>

          <Button
            onClick={handleConnect}
            disabled={loading}
            className="w-full shadow-lg shadow-primary/25 bg-primary"
          >
            {loading ? 'Connecting...' : 'Connect with Slack'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectSlack;
