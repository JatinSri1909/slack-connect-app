import { useState, useEffect } from 'react';
import {
  ConnectSlack,
  MessageComposer,
  ScheduledMessages,
} from './components/shared';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import './App.css';
import type { ISlackTeam } from './types';

function App() {
  const [connectedTeam, setConnectedTeam] = useState<ISlackTeam | null>(null);
  const [activeTab, setActiveTab] = useState<'compose' | 'scheduled'>(
    'compose',
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
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

  const handleConnect = (team: ISlackTeam) => {
    setConnectedTeam(team);
    localStorage.setItem('connected_slack_team', JSON.stringify(team));
  };

  const handleDisconnect = () => {
    setConnectedTeam(null);
    localStorage.removeItem('connected_slack_team');
  };

  const handleMessageSent = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!connectedTeam) {
    return <ConnectSlack onConnect={handleConnect} />;
  }

  return (
    <div className="min-h-screen bg-background font-slack-body">
      {/* Header */}
      <header className="border-b bg-card border-primary/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/25">
                <span className="text-primary-foreground font-slack-logo text-sm font-bold">
                  SC
                </span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-primary font-slack-logo">
                  SLACK CONNECT
                </h1>
                <p className="text-sm text-muted-foreground font-slack-body">
                  Connected to {connectedTeam.name}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground font-slack-body"
            >
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-4 max-w-4xl">
        {/* Tab Navigation */}
        <Card className="mb-6 border-primary/20">
          <CardContent>
            <div className="flex space-x-1">
              <Button
                variant={activeTab === 'compose' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('compose')}
                className={`flex-1 font-slack-body ${activeTab === 'compose' ? 'shadow-lg shadow-primary/25' : 'hover:bg-primary/10 hover:text-primary'}`}
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Compose Message
              </Button>
              <Button
                variant={activeTab === 'scheduled' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('scheduled')}
                className={`flex-1 font-slack-body ${activeTab === 'scheduled' ? 'shadow-lg shadow-primary/25' : 'hover:bg-primary/10 hover:text-primary'}`}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Scheduled Messages
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {activeTab === 'compose' && (
          <MessageComposer
            teamId={connectedTeam.id}
            onMessageSent={handleMessageSent}
          />
        )}
        {activeTab === 'scheduled' && (
          <ScheduledMessages
            teamId={connectedTeam.id}
            refreshTrigger={refreshTrigger}
          />
        )}
      </main>
    </div>
  );
}

export default App;
