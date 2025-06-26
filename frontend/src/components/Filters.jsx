import React from 'react';

export default function Filters({ teams, filterTeams, setFilterTeams, search, setSearch, allTypes, selectedTypes, setSelectedTypes }) {
  function handleTeamChange(e) {
    const { value, checked } = e.target;
    if (checked) setFilterTeams([...filterTeams, value]);
    else setFilterTeams(filterTeams.filter(t => t !== value));
  }
  function handleTypeChange(e) {
    const { value, checked } = e.target;
    if (value === 'All') {
      if (checked) setSelectedTypes(['All']);
      else setSelectedTypes([]);
    } else {
      let newTypes = selectedTypes.filter(t => t !== 'All');
      if (checked) newTypes = [...newTypes, value];
      else newTypes = newTypes.filter(t => t !== value);
      if (newTypes.length === 0) setSelectedTypes(['All']);
      else setSelectedTypes(newTypes);
    }
  }
  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', marginTop: 16, flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>Teams:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 400 }}>
          {teams.map(t => (
            <label key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <input type="checkbox" value={t.name} checked={filterTeams.includes(t.name)} onChange={handleTeamChange} />
              {t.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>Test Types:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 400 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <input type="checkbox" value="All" checked={selectedTypes.includes('All')} onChange={handleTypeChange} />
            All
          </label>
          {allTypes.map(t => (
            <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <input type="checkbox" value={t} checked={selectedTypes.includes(t) || selectedTypes.includes('All')} onChange={handleTypeChange} disabled={selectedTypes.includes('All')} />
              {t}
            </label>
          ))}
        </div>
      </div>
      <label style={{ marginLeft: 16 }}>
        Search:
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Project or Team name" />
      </label>
    </div>
  );
}
