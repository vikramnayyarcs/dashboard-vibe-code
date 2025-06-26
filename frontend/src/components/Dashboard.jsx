import React, { useState } from 'react';
import Filters from './Filters';
import ProjectCoverageGrid from './ProjectCoverageGrid';
import CoverageOverTimeChart from './CoverageOverTimeChart';
import Leaderboard from './Leaderboard';
import ChatAssistant from './ChatAssistant';
import { useTheme } from '../theme';

export default function Dashboard({ coverage, teams }) {
  const allTypes = Array.from(new Set(
    coverage.teams.flatMap(team => team.projects.flatMap(p => p.testTypes.map(tt => tt.type)))
  ));
  const allTeamNames = teams.map(t => t.name);
  const [filterTeams, setFilterTeams] = useState(allTeamNames);
  // Default to 'All' selected
  const [selectedTypes, setSelectedTypes] = useState(['All']);
  const [search, setSearch] = useState('');
  const { theme, setTheme } = useTheme();

  // If 'All' is selected, treat as all types
  const effectiveTypes = selectedTypes.includes('All') ? allTypes : selectedTypes;

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div className="saas-header">
        <span className="saas-logo">SMART Test Coverage</span>
        <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle light/dark mode">
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
      <div className="card">
        <Filters
          teams={teams}
          filterTeams={filterTeams}
          setFilterTeams={setFilterTeams}
          search={search}
          setSearch={setSearch}
          allTypes={allTypes}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
        />
      </div>
      <div className="card">
        <ProjectCoverageGrid coverage={coverage} teams={teams} filterTeams={filterTeams} search={search} selectedTypes={effectiveTypes} />
      </div>
      <div className="card">
        <CoverageOverTimeChart coverage={coverage} selectedTeams={filterTeams} selectedTypes={effectiveTypes} showAllCombined={selectedTypes.includes('All')} />
      </div>
      <div className="card">
        <Leaderboard coverage={coverage} />
      </div>
      <div className="card" style={{ marginTop: 32 }}>
        <h3>Chat Assistant</h3>
        <ChatAssistant />
      </div>
    </div>
  );
}
