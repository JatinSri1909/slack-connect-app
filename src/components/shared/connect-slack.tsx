import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import apiService from '@/services/api';
import type { IConnectSlackProps } from '@/types';

const ConnectSlack = (props: IConnectSlackProps) => {
  const { onConnect } = props;
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
        'width=600,height=700,scrollbars=yes,resizable=yes',
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
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-slack-body">
      <Card className="w-full max-w-md border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/25">
            <span className="text-primary-foreground font-slack-logo text-lg font-bold">
              SC
            </span>
          </div>
          <CardTitle className="text-primary font-slack-headline">Connect to Slack</CardTitle>
          <CardDescription className="font-slack-body">
            Connect your Slack workspace to start sending and scheduling
            messages
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
            className="w-full shadow-lg shadow-primary/25 bg-primary font-slack-body"
          >
            {loading ? 'Connecting...' : 'Connect with Slack'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectSlack;
