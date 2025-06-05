import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getRedisAlarms, getIncidentBySourceId, acknowledgeAlarm } from '../service/IncidentService';

const IncidentAlertPanal = (props) => {
  const [alarms, setAlarms] = useState([]);
  const [acknowledgedDevices, setAcknowledgedDevices] = useState(() => {
    const stored = localStorage.getItem('acknowledgedAlarms');
    return stored ? JSON.parse(stored) : {};
  });
  const [incidentIds, setIncidentIds] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    localStorage.setItem('acknowledgedAlarms', JSON.stringify(acknowledgedDevices));
  }, [acknowledgedDevices]);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const response = await getRedisAlarms();
        const data = response?.devices?.devices?.devices || [];
        setAlarms(data);
      } catch (error) {
        console.error('Error fetching alarms:', error);
      }
    };

    fetchAlarms();
    const interval = setInterval(fetchAlarms, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = async (deviceId, incidentId) => {
    try {
      setAcknowledgedDevices((prev) => ({
        ...prev,
        [deviceId]: true,
      }));

      const timestamp = new Date().toISOString();
      const incidentResponse = await getIncidentBySourceId(incidentId, props?.keycloak?.idToken || '');
      const pkIncId = incidentResponse.data.pk_inc_id;

      setIncidentIds((prev) => ({
        ...prev,
        [deviceId]: pkIncId,
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

      setAcknowledgedDevices((prev) => ({
        ...prev,
        [deviceId]: false,
      }));
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

        .incident-link {
          display: inline-block;
          margin-top: 10px;
          padding: 6px 14px;
          font-size: 14px;
          font-weight: 500;
          background-color: #333;
          color: white;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .incident-link:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }
      `}
      </style>

      <div className={`alert-scroll ${alarms.length === 0 ? 'no-alarm' : ''}`}>
        {alarms.length > 0 ? (
          alarms.map((incident) => {
            const deviceId = incident.device_id;
            const incidentId = incident.incident_id;
            const isAcknowledged = acknowledgedDevices[deviceId];
            const pkIncId = incidentIds[deviceId];

            return (
              <div key={deviceId} className={`alert-card ${!isAcknowledged ? 'active' : ''}`}>
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
                  Sensor Type - {incident.sensor_type} | Timestamp - {incident.timestamp}
                </p>

                {isAcknowledged ? (
                  <>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'center', gap: '10px' }}>
                    <button className="acknowledge-btn acknowledged" disabled>
                      Acknowledged
                    </button>
                    {pkIncId && (
                      <a
                        className="incident-link"
                        href={`https://devs.hitachivisualization.com/incidents/${pkIncId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Go to Incident
                      </a>
                    )}
                    </div>
                  </>
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
            <h3 style={{ fontSize: '18px', margin: 0, color: '#666' }}>No Active Alarm</h3>
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default IncidentAlertPanal;