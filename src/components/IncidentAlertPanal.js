import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {
  subscribeToIncidentData,
  acknowledgeAlarm
} from '../service/IncidentService';

const ACK_EXPIRE_MINUTES = 10; 


const IncidentAlertPanal = (props) => {
  console.log("keycloack props-->",props)
  const [alarms, setAlarms] = useState([]);
  const [acknowledgedIncidents, setAcknowledgedIncidents] = useState(() => {
    const stored = localStorage.getItem('acknowledgedIncidents');
    return stored ? JSON.parse(stored) : {};
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Cleanup expired acknowledgments every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updated = { ...acknowledgedIncidents };
      let changed = false;

      Object.entries(updated).forEach(([incidentId, data]) => {
        const acknowledgedAt = new Date(data.timestamp);
        const diff = (now - acknowledgedAt) / 1000 / 60;
        if (diff > ACK_EXPIRE_MINUTES) {
          delete updated[incidentId];
          changed = true;
        }
      });

      if (changed) {
        setAcknowledgedIncidents(updated);
        localStorage.setItem('acknowledgedIncidents', JSON.stringify(updated));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [acknowledgedIncidents]);

  useEffect(() => {
    localStorage.setItem('acknowledgedIncidents', JSON.stringify(acknowledgedIncidents));
  }, [acknowledgedIncidents]);

  useEffect(() => {
    const eventSource = subscribeToIncidentData((data) => {
      const deviceMap = data?.devices || {};
      const allIncidents = Object.values(deviceMap).flat();
      setAlarms(allIncidents);
    });

    return () => eventSource.close();
  }, []);

  const handleAcknowledge = async (deviceId, incidentId) => {
    try {
      const timestamp = new Date().toISOString();
      setAcknowledgedIncidents((prev) => ({
        ...prev,
        [incidentId]: { timestamp },
      }));

      const message = await acknowledgeAlarm(deviceId, timestamp);

      setSnackbar({
        open: true,
        message,
        severity: 'success',
      });
    } catch (error) {
      console.error('Acknowledgment error:', error.message);
      setSnackbar({
        open: true,
        message: `Failed to acknowledge: ${error.message}`,
        severity: 'error',
      });

      setAcknowledgedIncidents((prev) => {
        const newState = { ...prev };
        delete newState[incidentId];
        return newState;
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <style>
        {`
        @keyframes blinkAlert {
          0% { background-color: white; }
          50% { background-color: red; color: white; }
          100% { background-color: white; }
        }

        @keyframes blinkButton {
          0% { background-color: #333; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
          50% { background-color: #333; box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4), 0 0 20px rgba(211, 47, 47, 0.3); }
          100% { background-color: #333; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        }

        .alert-card {
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          padding: 16px;
          position: relative;
          width: 100%;
          border: 2px solid #ffcdd2;
          text-align: center;
        }

        .alert-card.active {
          animation: blinkAlert 2s infinite;
        }

        .no-alarm-card {
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          padding: 16px;
          position: relative;
          width: 100%;
          border: 2px solid green;
          text-align: center;
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .alert-scroll {
          max-height: 85vh;
          overflow-y: auto;
          padding-right: 8px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .alert-scroll.no-alarm {
          justify-content: center;
          align-items: center;
          min-height: 85vh;
        }

        .alert-scroll::-webkit-scrollbar {
          display: none;
        }

        .acknowledge-btn {
          animation: blinkButton 2s infinite;
          transition: all 0.3s ease;
          margin-top: 12px;
          padding: 8px 16px;
          background-color: #333;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 16px;
        }

        .acknowledge-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(211, 47, 47, 0.5), 0 0 25px rgba(211, 47, 47, 0.4) !important;
        }

        .acknowledge-btn:active {
          transform: translateY(0);
        }

        .acknowledged {
          background-color: gray !important;
          animation: none !important;
          cursor: default;
        }
      `}
      </style>

      <div className={`alert-scroll ${alarms.length === 0 ? 'no-alarm' : ''}`}>
        {alarms.length > 0 ? (
          alarms.map((incident) => {
            const deviceId = incident.device_id;
            const incidentId = incident.incident_id;
            const isAcknowledged = !!acknowledgedIncidents[incidentId];

            return (
              <div
                key={deviceId + incidentId}
                className={`alert-card ${!isAcknowledged ? 'active' : ''}`}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '26px',
                    height: '14px',
                    backgroundColor: '#ffcdd2',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    zIndex: 1,
                  }}
                />
                <h3 style={{ fontSize: '18px', margin: 0 }}>
                  {incident.sensor_name} Alarm - {incident.location || 'Unknown Location'}
                </h3>
                <p style={{ fontSize: '14px', margin: '8px 0' }}>
                  Sensor Type - {incident.sensor_type}
                </p>
                <p style={{ fontSize: '14px', margin: '8px 0' }}>
                  Sensor Type - {incident.alarm_type}
                </p>

                {isAcknowledged ? (
                  <button className="acknowledge-btn acknowledged" disabled>
                    Acknowledged
                  </button>
                ) : (
                  <button
                    onClick={() => handleAcknowledge(deviceId, incidentId)}
                    className="acknowledge-btn"
                  >
                    Acknowledge Alarm
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-alarm-card">
            <h3 style={{ fontSize: '18px', margin: 0, color: '#666' }}>
              No Active Alarm
            </h3>
          </div>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 1500 }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default IncidentAlertPanal;
