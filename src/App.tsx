import { useState, useEffect } from 'react';
import ConnectSlack from './components/connect-slack';
import MessageComposer from './components/message-composer';
import ScheduledMessages from './components/scheduled-message';
import './App.css';

interface SlackTeam {
  id: string;
  name: string;
}

function App() {
  const [connectedTeam, setConnectedTeam] = useState<SlackTeam | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Check if there's a stored team connection
    const storedTeam = localStorage.getItem('connected_slack_team');
    if (storedTeam) {
      try {
        setConnectedTeam(JSON.parse(storedTeam));
      } catch (error) {
        console.error('Error parsing stored team data:', error);
        localStorage.removeItem('connected_slack_team');
      }
    }
  }, []);

  const handleConnect = (team: SlackTeam) => {
    setConnectedTeam(team);
    localStorage.setItem('connected_slack_team', JSON.stringify(team));
  };

  const handleDisconnect = () => {
    setConnectedTeam(null);
    localStorage.removeItem('connected_slack_team');
    // Also clear any OAuth callback data
    localStorage.removeItem('slack_team');
  };

  const handleMessageSent = () => {
    // Trigger refresh of scheduled messages list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleReconnect = () => {
    handleDisconnect();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>Slack Connect</h1>
            <p>Send and schedule messages to your Slack workspace</p>
          </div>
          
          {connectedTeam && (
            <div className="connection-status">
              <div className="connected-team">
                <span className="connection-indicator"></span>
                <div className="team-info">
                  <span className="team-name">{connectedTeam.name}</span>
                  <span className="connection-label">Connected</span>
                </div>
              </div>
              <div className="connection-actions">
                <button onClick={handleReconnect} className="reconnect-button">
                  Switch Workspace
                </button>
                <button onClick={handleDisconnect} className="disconnect-button">
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {!connectedTeam ? (
            <ConnectSlack onConnect={handleConnect} />
          ) : (
            <div className="dashboard">
              <MessageComposer 
                teamId={connectedTeam.id} 
                onMessageSent={handleMessageSent}
              />
              
              <ScheduledMessages 
                teamId={connectedTeam.id}
                refreshTrigger={refreshTrigger}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 Slack Connect. Built with React & TypeScript.</p>
          <div className="footer-links">
            <a href="https://api.slack.com/docs" target="_blank" rel="noopener noreferrer">
              Slack API Docs
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;