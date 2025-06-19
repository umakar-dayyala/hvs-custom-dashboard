import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import {
  subscribeToIncidentData,
  acknowledgeAlarm,
  getIncidentBySourceId,
} from '../service/IncidentService';
import '../css/IncidentAlertPanal.css';

const IncidentAlertPanal = (props) => {
  const [alarms, setAlarms] = useState([]);
  const [acknowledgedIncidents, setAcknowledgedIncidents] = useState({});
  const [incidentPkMap, setIncidentPkMap] = useState({});
  const [pollingIntervals, setPollingIntervals] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const eventSource = subscribeToIncidentData((data) => {
      const deviceMap = data?.devices || {};
      const newIncidents = Object.values(deviceMap).flat();
      setAlarms((prevAlarms) => {
        const isSame =
          prevAlarms.length === newIncidents.length &&
          prevAlarms.every((prev) =>
            newIncidents.find(
              (inc) =>
                inc.incident_id === prev.incident_id &&
                JSON.stringify(inc) === JSON.stringify(prev)
            )
          );
        return isSame ? prevAlarms : newIncidents;
      });
    });

    return () => eventSource.close();
  }, []);

  useEffect(() => {
    return () => {
      Object.values(pollingIntervals).forEach(clearInterval);
    };
  }, [pollingIntervals]);

  const handleAcknowledge = async (deviceId, incidentId, alarm_type) => {
    try {
      const timestamp = new Date().toISOString();
      const incidentResponse = await getIncidentBySourceId(
        incidentId,
        props?.props?.keycloak?.token || ''
      );

      const pkIncId = incidentResponse?.data?.pk_inc_id;
      const fk_inc_status_id = incidentResponse?.data?.fk_inc_status_id;

      if (!pkIncId || !fk_inc_status_id) {
        throw new Error('Invalid incident data received.');
      }

      const payload = {
        device_id: deviceId || '',
        incident_id: incidentId || '',
        alarm_type: alarm_type || '',
        pkIncId,
        fk_inc_status_id,
        timestamp,
      };

      const message = await acknowledgeAlarm(payload);
      setSnackbar({ open: true, message, severity: 'success' });

      setAcknowledgedIncidents((prev) => ({
        ...prev,
        [incidentId]: true,
      }));

      setIncidentPkMap((prev) => ({
        ...prev,
        [incidentId]: pkIncId,
      }));

      if (!pollingIntervals[incidentId]) {
        const intervalId = setInterval(async () => {
          try {
            // console.log(`Polling for incident ${incidentId}...`);
            const res = await getIncidentBySourceId(
              incidentId,
              props?.props?.keycloak?.token || ''
            );
            const latestStatusId = res?.data?.fk_inc_status_id;

            if (latestStatusId && latestStatusId !== fk_inc_status_id) {
              const updatedPayload = {
                device_id: deviceId || '',
                incident_id: incidentId || '',
                alarm_type: alarm_type || '',
                pkIncId: pkIncId,
                fk_inc_status_id: latestStatusId,
                timestamp: new Date().toISOString(),
              };

              const updateMessage = await acknowledgeAlarm(updatedPayload);
              setSnackbar({
                open: true,
                message: updateMessage,
                severity: 'info',
              });

              clearInterval(pollingIntervals[incidentId]);
              setPollingIntervals((prev) => {
                const updated = { ...prev };
                delete updated[incidentId];
                return updated;
              });

              setAcknowledgedIncidents((prev) => ({
                ...prev,
                [incidentId]: true,
              }));
            }
          } catch (err) {
            console.error(`Polling error for ${incidentId}:`, err.message);
          }
        }, 60000);

        setPollingIntervals((prev) => ({
          ...prev,
          [incidentId]: intervalId,
        }));
      }
    } catch (error) {
      console.error('Acknowledgment error:', error.message);
      setSnackbar({
        open: true,
        message: `Failed to acknowledge: ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <div className={`alert-scroll ${alarms.length === 0 ? 'no-alarm' : ''}`} style={{ padding: '16px' }}>
        {alarms.length > 0 ? (
          alarms.map((incident) => {
            const {
              device_id,
              incident_id,
              alarm_type,
              sensor_name,
              sensor_type,
              location,
              ack_status,
              pk_inc_id,
              incident_status,
            } = incident;

            const isAcknowledged =
              acknowledgedIncidents[incident_id] || ack_status === '1';

            return (
              <div
                key={device_id + incident_id}
                className="alert-card"
                style={{
                  background: '#fdfdfd',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  borderLeft:  '6px solid #f44336',
                  position: 'relative',
                }}
              >
                <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#333' }}>
                  🚨 {sensor_name} - {location || 'Unknown Location'}
                </h3>
                <p style={{ fontSize: '14px', margin: '4px 0', color: '#555' }}>
                  <strong>Sensor Type:</strong> {sensor_type}
                </p>
                <p style={{ fontSize: '14px', margin: '4px 0', color: '#555' }}>
                  <strong>Alarm Type:</strong> {alarm_type || 'Unknown'}
                </p>

                <Chip
  label={`Incident Status: ${incident_status || 'N/A'}`}
  color={
    (() => {
      const status = (incident_status || '').toLowerCase();
      if (status === 'new incident') return 'error';
      if (status === 'open') return 'warning';
      if (status === 'closed') return 'success';
      if (status === 'withdrawn') return 'default';
      return 'default';
    })()
  }
  variant="outlined"
  size="small"
  sx={{ marginTop: '8px', textTransform: 'capitalize' }}
/>


                <div className="button-row" style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                  {isAcknowledged ? (
                    <>
                      <button
                        className="acknowledge-btn acknowledged"
                        disabled
                        style={{
                          backgroundColor: '#c8e6c9',
                          border: 'none',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          pointerEvents: 'none',
                        }}
                      >
                        ✅ Acknowledged
                      </button>
                      <button
                        className="go-btn"
                        onClick={() =>
                          window.open(
                            `https://devs.hitachivisualization.com/incidents/${pk_inc_id || ''}`,
                            '_blank'
                          )
                        }
                        style={{
                          backgroundColor: '#1976d2',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        🔗 Go to Incident
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        handleAcknowledge(device_id, incident_id, alarm_type)
                      }
                      className="acknowledge-btn"
                      style={{
                        backgroundColor: '#f44336',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Acknowledge Alarm
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-alarm-card">
            <h3 style={{ fontSize: '18px', margin: 0, color: '#666' }}>
              ✅ No Active Alarm
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
