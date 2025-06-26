import React from 'react';

export default function Leaderboard({ coverage }) {
  // Flatten all projects with their latest average coverage
  const projects = [];
  coverage.teams.forEach(team => {
    team.projects.forEach(project => {
      let total = 0, count = 0;
      project.testTypes.forEach(tt => {
        const last = tt.history[tt.history.length - 1];
        if (last) {
          total += last.coverage;
          count++;
        }
      });
      projects.push({
        team: team.name,
        project: project.name,
        avgCoverage: count ? (total / count) : 0
      });
    });
  });
  const sorted = projects.sort((a, b) => b.avgCoverage - a.avgCoverage).slice(0, 5);
  return (
    <div>
      <h3>Leaderboard (Top Projects)</h3>
      <ol>
        {sorted.map(p => (
          <li key={p.project + p.team}>
            <b>{p.project}</b> ({p.team}) - {p.avgCoverage.toFixed(1)}%
          </li>
        ))}
      </ol>
    </div>
  );
}
