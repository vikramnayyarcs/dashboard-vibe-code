import React, { useMemo } from 'react';
import { AgChartsReact } from 'ag-charts-react';

export default function CoverageOverTimeChart({ coverage, selectedTeams, selectedTypes, showAllCombined }) {
  // Gather all releases
  const releases = useMemo(() => {
    const set = new Set();
    (coverage.teams || []).forEach(team => (team.projects || []).forEach(p => (p.testTypes || []).forEach(tt => (tt.history || []).forEach(h => set.add(h.release)))));
    return Array.from(set).sort();
  }, [coverage]);

  let series = [];

  if (showAllCombined) {
    // For each release, average all selected teams/types
    const avgData = releases.map(release => {
      let sum = 0, count = 0;
      (coverage.teams || []).forEach(team => {
        if (selectedTeams && selectedTeams.length > 0 && !selectedTeams.includes(team.name)) return;
        (team.projects || []).forEach(project => {
          (project.testTypes || []).forEach(tt => {
            const found = (tt.history || []).find(h => h.release === release);
            if (found) {
              sum += found.coverage;
              count++;
            }
          });
        });
      });
      return { release, coverage: count ? sum / count : null };
    });
    series = [{
      type: 'line',
      title: 'All (Average)',
      xKey: 'release',
      yKey: 'coverage',
      data: avgData
    }];
  } else {
    // Build series for each team/project/type
    (coverage.teams || []).forEach(team => {
      if (selectedTeams && selectedTeams.length > 0 && !selectedTeams.includes(team.name)) return;
      (team.projects || []).forEach(project => {
        (project.testTypes || []).forEach(tt => {
          if (selectedTypes && selectedTypes.length > 0 && !selectedTypes.includes(tt.type)) return;
          const data = releases.map(r => {
            const found = (tt.history || []).find(h => h.release === r);
            return found ? found.coverage : null;
          });
          series.push({
            type: 'line',
            title: `${team.name} / ${project.name} / ${tt.type}`,
            xKey: 'release',
            yKey: 'coverage',
            data: releases.map((release, i) => ({ release, coverage: data[i] }))
          });
        });
      });
    });
  }

  const options = {
    data: [], // not used, series provides data
    series,
    axes: [
      { type: 'category', position: 'bottom', title: { text: 'Release' } },
      { type: 'number', position: 'left', title: { text: 'Coverage %' }, min: 0, max: 100 }
    ],
    legend: { enabled: true },
    height: 300
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Coverage Over Time</h3>
      <AgChartsReact options={options} />
    </div>
  );
}
