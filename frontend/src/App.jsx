import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';

export default function App() {
  const [coverage, setCoverage] = useState(null);
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/coverage')
      .then(res => res.json())
      .then(setCoverage);
    fetch('http://localhost:4000/api/teams')
      .then(res => res.json())
      .then(setTeams);
  }, []);

  if (!coverage || !teams) return <div>Loading...</div>;

  return <Dashboard coverage={coverage} teams={teams} />;
}
