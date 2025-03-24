import React from 'react';
import Plot from 'react-plotly.js';

const FloorWiseChart = () => {
  const sensors = [
    { zone: '1', location: 'At Makar Dwar (Left side)', sensor: 'AGM (Area Gamma Monitor)', status: 'active' },
    { zone: '1', location: 'At Makar Dwar (Left side)', sensor: 'PRM (Pedestrian Radiation Monitor)', status: 'active' },
    { zone: '1', location: 'Zone-1 Corridor', sensor: 'FC1 (IMS based Chemical Detector)', status: 'active' },
    { zone: '2 (PMO)', location: 'Zone-2 Corridor', sensor: 'FC2 (FPD based Chemical Detector)', status: 'active' },
    { zone: '2 (PMO)', location: 'Zone-2 Corridor', sensor: 'FB1 (LIF based Biological Detector)', status: 'active' },
    { zone: '3', location: 'At Hans Dwar (Left side)', sensor: 'PRM (Pedestrian Radiation Monitor)', status: 'active' },
    { zone: '3', location: 'At Hans Dwar (Left side)', sensor: 'AGM (Area Gamma Monitor)', status: 'active' },
    { zone: '4', location: 'At Garuda Dwar (Left side)', sensor: 'PRM (Pedestrian Radiation Monitor)', status: 'inactive' },
    { zone: '4', location: 'At Garuda Dwar (Left side)', sensor: 'FC1 (IMS based Chemical Detector)', status: 'inactive' },
    { zone: '5', location: 'At Shardul Dwar (Left side)', sensor: 'PRM (Pedestrian Radiation Monitor)', status: 'inactive' },
    { zone: '5', location: 'At Shardul Dwar (Left side)', sensor: 'AGM (Area Gamma Monitor)', status: 'inactive' },
    { zone: 'Lok Sabha Chamber', location: 'Inside Lok Sabha Chamber', sensor: 'FC1 (IMS based Chemical Detector)', status: 'inactive' },
    { zone: 'Rajya Sabha Chamber', location: 'Inside Rajya Sabha Chamber', sensor: 'FC2 (FPD based Chemical Detector)', status: 'inactive' },
  ];

  // Create labels, parents, and colors
  const labels = [];
  const parents = [];
  const colors = [];
  const seenZones = new Set();
  const seenLocations = new Set();

  sensors.forEach(({ zone, location, sensor, status }) => {
    // Add Zone only once
    if (!seenZones.has(zone)) {
      labels.push(zone);
      parents.push('');
      colors.push('#90CAF9'); // Zone color
      seenZones.add(zone);
    }

    // Add Location under Zone only once
    const locationKey = `${zone}-${location}`;
    if (!seenLocations.has(locationKey)) {
      labels.push(location);
      parents.push(zone);
      colors.push('#64B5F6'); // Location color
      seenLocations.add(locationKey);
    }

    // Add Sensor under Location
    labels.push(sensor);
    parents.push(location);
    colors.push(status === 'active' ? '#4CAF50' : '#E30613'); // Green for active, Red for inactive
  });

  const data = [
    {
      type: 'treemap',
      labels,
      parents,
      marker: { colors },
      textinfo: 'label+text',
      hoverinfo: 'none',
      leaf: {opacity: 0.6}, // Reduce opacity of leaf nodes
      maxdepth: 4, // Restricts the depth of the treemap
      branchvalues: 'total', // Ensures each child is drawn without needing to click
    },
  ];

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Plot
        data={data}
        layout={{
          title: 'Sensor Status Treemap',
          margin: { t: 50, l: 0, r: 0, b: 0 },
          height: 600,
          uniformtext: {mode: 'hide', minsize: 10} //

        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default FloorWiseChart;
