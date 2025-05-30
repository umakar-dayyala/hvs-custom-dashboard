import React from 'react';
import { useNavigate } from "react-router-dom";

const dummyAlerts = [
  { id: 1, location: 'North Wing Sensor' },
  { id: 2, location: 'Main Entrance' },
  { id: 3, location: 'Control Room' },
  { id: 4, location: 'Basement' },
  { id: 10, location: 'North Wing Sensor' },
  { id: 20, location: 'Main Entrance' },
  { id: 30, location: 'Control Room' },
  { id: 40, location: 'Basement' },
  { id: 11, location: 'North Wing Sensor' },
  { id: 21, location: 'Main Entrance' },
  { id: 31, location: 'Control Room' },
  { id: 41, location: 'Basement' },
  { id: 101, location: 'North Wing Sensor' },
  { id: 201, location: 'Main Entrance' },
  { id: 301, location: 'Control Room' },
  { id: 401, location: 'Basement' },
];

const IncidentAlertPanal = () => {
    const navigate = useNavigate();

    const handleAcknowledge = (alertId) => {
      // Navigate to an alert-specific page or any route you want
      navigate(`/alerts/${alertId}`);
    };

  return (
    <>
      {/* <style>
        {`
         
          .alert-scroll::-webkit-scrollbar {
            display: none;
          }
        `}
      </style> */}
      <div className="alert-scroll" style={{
        maxHeight: '85vh',
        overflowY: 'auto',
        paddingRight: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        scrollbarWidth: 'none',          // Firefox
        msOverflowStyle: 'none'          // IE/Edge
      }}>
        {dummyAlerts.map((alert) => (
          <div key={alert.id} style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            padding: '16px',
            position: 'relative',
            width: '100%',
          }}>
            <h3 style={{ fontSize: '18px', margin: 0 }}>{alert.location}</h3>
            <button onClick={() => handleAcknowledge(alert.id)}
             style={{
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Acknowledge Alarm
            </button>
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '12px solid white'
            }} />
          </div>
        ))}
      </div>
    </>
  );
};

export default IncidentAlertPanal;

