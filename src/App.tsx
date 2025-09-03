import { useState, useEffect } from 'react';
import ConnectSlack from './components/connect-slack';
import MessageComposer from './components/message-composer';
import ScheduledMessages from './components/scheduled-message';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import './App.css';

interface SlackTeam {
  id: string;
  name: string;
}

function App() {
  const [connectedTeam, setConnectedTeam] = useState<SlackTeam | null>(null);
  const [activeTab, setActiveTab] = useState<'compose' | 'scheduled'>('compose');
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

  const handleConnect = (team: SlackTeam) => {
    setConnectedTeam(team);
    localStorage.setItem('connected_slack_team', JSON.stringify(team));
  };

  const handleDisconnect = () => {
    setConnectedTeam(null);
    localStorage.removeItem('connected_slack_team');
  };

  const handleMessageSent = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!connectedTeam) {
    return <ConnectSlack onConnect={handleConnect} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card border-primary/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/25">
                <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-primary">Slack Connect</h1>
                <p className="text-sm text-muted-foreground">Connected to {connectedTeam.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleDisconnect} className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
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
                className={`flex-1 ${activeTab === 'compose' ? 'shadow-lg shadow-primary/25' : 'hover:bg-primary/10 hover:text-primary'}`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Compose Message
              </Button>
              <Button
                variant={activeTab === 'scheduled' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('scheduled')}
                className={`flex-1 ${activeTab === 'scheduled' ? 'shadow-lg shadow-primary/25' : 'hover:bg-primary/10 hover:text-primary'}`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Scheduled Messages
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {activeTab === 'compose' && (
          <MessageComposer teamId={connectedTeam.id} onMessageSent={handleMessageSent} />
        )}
        {activeTab === 'scheduled' && (
          <ScheduledMessages teamId={connectedTeam.id} refreshTrigger={refreshTrigger} />
        )}
      </main>
    </div>
  );
}

export default App;
