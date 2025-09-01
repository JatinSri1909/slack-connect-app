import React, { useState } from 'react';
import apiService from '../services/api';

interface ConnectSlackProps {
  onConnect: (team: { id: string; name: string }) => void;
}

const ConnectSlack: React.FC<ConnectSlackProps> = ({ onConnect }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { authUrl } = await apiService.getSlackAuthUrl();
      
      // Open OAuth popup
      const popup = window.open(
        authUrl,
        'slack-oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      // Listen for the OAuth callback
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setLoading(false);
          
          // Check if we have team info in localStorage (set by callback handler)
          const teamData = localStorage.getItem('slack_team');
          if (teamData) {
            const team = JSON.parse(teamData);
            localStorage.removeItem('slack_team');
            onConnect(team);
          }
        }
      }, 1000);

      // Listen for messages from popup (OAuth success)
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'SLACK_OAUTH_SUCCESS') {
          popup?.close();
          window.removeEventListener('message', messageListener);
          setLoading(false);
          onConnect(event.data.team);
        } else if (event.data.type === 'SLACK_OAUTH_ERROR') {
          popup?.close();
          window.removeEventListener('message', messageListener);
          setLoading(false);
          setError(event.data.error);
        }
      };

      window.addEventListener('message', messageListener);
      
    } catch (error) {
      setLoading(false);
      setError('Failed to initiate Slack connection');
      console.error('Connection error:', error);
    }
  };

  return (
    <div className="connect-slack">
      <div className="connect-slack-card">
        <div className="slack-logo">
          <img src="/slack-logo.png" alt="Slack" />
        </div>
        <h2>Connect to Slack</h2>
        <p>Connect your Slack workspace to start sending and scheduling messages.</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <button 
          onClick={handleConnect}
          disabled={loading}
          className="connect-button"
        >
          {loading ? 'Connecting...' : 'Connect to Slack'}
        </button>
      </div>
    </div>
  );
};

export default ConnectSlack;