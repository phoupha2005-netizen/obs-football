import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { MatchControlView } from './components/match/MatchControlView';
import { SubstitutionManagerView } from './components/substitution/SubstitutionManagerView';
import { PlayerManagerView } from './components/players/PlayerManagerView';
import { TeamManagerView } from './components/teams/TeamManagerView';
import { LowerThirdDesigner } from './components/designer/LowerThirdDesigner';
import { OBSSourcesManagerView } from './components/obs/OBSSourcesManagerView';
import { TagMappingView } from './components/tags/TagMappingView';
import { TemplatesView } from './components/templates/TemplatesView';
import { LocalBridgeView } from './components/bridge/LocalBridgeView';
import { SettingsView } from './components/settings/SettingsView';
import { BrowserDockView } from './components/dock/BrowserDockView';
import { OBSOverlayView } from './components/overlay/OBSOverlayView';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Sync tab with URL hash if present
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setCurrentTab(hash);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab;
  };

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView onNavigate={handleTabChange} />;
      case 'match_control':
        return <MatchControlView />;
      case 'sub_manager':
        return <SubstitutionManagerView />;
      case 'player_manager':
        return <PlayerManagerView />;
      case 'team_manager':
        return <TeamManagerView />;
      case 'designer':
        return <LowerThirdDesigner />;
      case 'obs_manager':
        return <OBSSourcesManagerView />;
      case 'tag_mapping':
        return <TagMappingView />;
      case 'templates':
        return <TemplatesView onNavigateToDesigner={() => handleTabChange('designer')} />;
      case 'local_bridge':
        return <LocalBridgeView />;
      case 'settings':
        return <SettingsView />;
      case 'browser_dock':
        return <BrowserDockView isStandalone={false} />;
      case 'overlay_preview':
        return <OBSOverlayView isStandalone={false} />;
      default:
        return <DashboardView onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar currentTab={currentTab} setCurrentTab={handleTabChange} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentTab={currentTab} setCurrentTab={handleTabChange} />
        <main className="flex-1 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const pathname = window.location.pathname.toLowerCase();

  // Route 1: OBS Custom Browser Dock (/dock, /dock/substitution, /dock/match, etc.)
  if (pathname.startsWith('/dock')) {
    let subTab: 'sub' | 'match' | 'sources' | 'scoreboard' = 'sub';
    if (pathname.includes('match')) subTab = 'match';
    else if (pathname.includes('sources')) subTab = 'sources';
    else if (pathname.includes('scoreboard')) subTab = 'scoreboard';

    return (
      <AppProvider>
        <BrowserDockView isStandalone={true} initialSubTab={subTab} />
      </AppProvider>
    );
  }

  // Route 2: Standalone OBS Browser Source Overlay (/overlay)
  if (pathname.startsWith('/overlay')) {
    return (
      <AppProvider>
        <OBSOverlayView isStandalone={true} />
      </AppProvider>
    );
  }

  // Standard Full Broadcast Control Application
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
