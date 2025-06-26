import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Accept teams prop (from teams.json)
export default function ProjectCoverageGrid({ coverage, teams, filterTeams, search, selectedTypes }) {
  // Merge teams.json and coverage.json to ensure all teams are shown
  const rowData = useMemo(() => {
    // Build a map of coverage data by team name for quick lookup
    const coverageMap = {};
    (coverage.teams || []).forEach(team => {
      coverageMap[team.name] = team;
    });
    let rows = [];
    (teams || []).forEach(teamObj => {
      // Filter by team selection
      if (filterTeams && filterTeams.length > 0 && !filterTeams.includes(teamObj.name)) return;
      const coverageTeam = coverageMap[teamObj.name];
      if (coverageTeam && (coverageTeam.projects || []).length > 0) {
        (coverageTeam.projects || []).forEach(project => {
          if (search && !project.name.toLowerCase().includes(search.toLowerCase()) && !teamObj.name.toLowerCase().includes(search.toLowerCase())) return;
          const projectTypes = (project.testTypes || []).map(tt => tt.type);
          if (selectedTypes && selectedTypes.length > 0 && !selectedTypes.some(type => projectTypes.includes(type))) return;
          const testTypes = projectTypes.join(', ');
          const latest = {};
          (project.testTypes || []).forEach(tt => {
            const last = tt.history[tt.history.length - 1];
            latest[tt.type] = last ? last.coverage : null;
          });
          rows.push({
            team: teamObj.name,
            project: project.name,
            testTypes,
            ...latest,
            supportedTestTypes: coverageTeam.supportedTestTypes
          });
        });
      } else {
        // No projects or coverage for this team
        if (search && !teamObj.name.toLowerCase().includes(search.toLowerCase())) return;
        // If test type filter is active, only show if team supports at least one selected type (if supportedTestTypes is available)
        let supportedTestTypes = (coverageTeam && coverageTeam.supportedTestTypes) || [];
        if (selectedTypes && selectedTypes.length > 0 && !selectedTypes.some(type => supportedTestTypes.includes(type))) return;
        rows.push({
          team: teamObj.name,
          project: '',
          testTypes: '',
          supportedTestTypes,
        });
      }
    });
    return rows;
  }, [coverage, teams, filterTeams, search, selectedTypes]);

  // Find all test types for columns
  const allTypes = useMemo(() => {
    const set = new Set();
    (coverage.teams || []).forEach(team => (team.projects || []).forEach(p => (p.testTypes || []).forEach(tt => set.add(tt.type))));
    return Array.from(set);
  }, [coverage]);

  const columns = [
    { headerName: 'Team', field: 'team', filter: true },
    { headerName: 'Project', field: 'project', filter: true },
    { headerName: 'Test Types', field: 'testTypes' },
    ...allTypes.map(type => ({ headerName: `${type} Coverage %`, field: type, valueFormatter: p => p.value != null ? p.value + '%' : '—', cellStyle: p => p.value < 60 ? { background: '#ffeaea' } : {} }))
  ];

  // Show a note if a team does not support a selected type
  let unsupportedNote = null;
  if (selectedTypes && selectedTypes.length > 0) {
    const unsupportedTeams = (coverage.teams || []).filter(team => selectedTypes.some(type => !(team.supportedTestTypes || []).includes(type)) && (!filterTeams || filterTeams.includes(team.name)));
    if (unsupportedTeams.length > 0) {
      unsupportedNote = (
        <div style={{ color: '#f59e42', marginBottom: 8 }}>
          Note: Some teams do not support selected test types: {unsupportedTeams.map(t => t.name).join(', ')}
        </div>
      );
    }
  }

  return (
    <div>
      {unsupportedNote}
      <div className="ag-theme-alpine" style={{ minHeight: 300, width: '100%', marginTop: 8, overflowX: 'auto', borderRadius: 10 }}>
        <AgGridReact rowData={rowData} columnDefs={columns} domLayout="autoHeight" />
      </div>
    </div>
  );
}
