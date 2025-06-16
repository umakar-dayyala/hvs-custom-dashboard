import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {
  subscribeToIncidentData,
  acknowledgeAlarm,
  getIncidentBySourceId,
} from '../service/IncidentService';
import '../css/IncidentAlertPanal.css';

const IncidentAlertPanal = (props) => {
  const [alarms, setAlarms] = useState([]);
  const [ssedata, setsseData] = useState([]);
  const [acknowledgedIncidents, setAcknowledgedIncidents] = useState({});
  const [incidentPkMap, setIncidentPkMap] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const eventSource = subscribeToIncidentData((data) => {
      setsseData(data);
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

  const handleAcknowledge = async (deviceId, incidentId, alarm_type) => {
    try {
      const timestamp = new Date().toISOString();
      const incidentResponse = await getIncidentBySourceId(
        incidentId,
        props?.keycloak?.token || ''
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

      // Save acknowledged status and pkIncId
      setAcknowledgedIncidents((prev) => ({
        ...prev,
        [incidentId]: true,
      }));

      setIncidentPkMap((prev) => ({
        ...prev,
        [incidentId]: pkIncId,
      }));
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
      <div className={`alert-scroll ${alarms.length === 0 ? 'no-alarm' : ''}`}>
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
              fk_inc_status_id
            } = incident;

           console.log(`pk_inc_id for incident ${incident_id}:`, pk_inc_id);

            const isAcknowledged =
              acknowledgedIncidents[incident_id] || ack_status === '1';

            return (
              <div
                key={device_id + incident_id}
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
                  {sensor_name} Alarm - {location || 'Unknown Location'}
                </h3>
                <p style={{ fontSize: '14px', margin: '8px 0' }}>
                  Sensor Type - {sensor_type}
                </p>
                <p style={{ fontSize: '14px', margin: '8px 0' }}>
                  Alarm Type - {alarm_type || 'Unknown'}
                </p>

                <div className="button-row">
                  {isAcknowledged ? (
                    <>
                      <button className="acknowledge-btn acknowledged" disabled>
                        Acknowledged
                      </button>
                      <button
                        className="go-btn"
                        onClick={() =>
                          window.open(
                            `https://devs.hitachivisualization.com/incidents/${incident.pk_inc_id|| ''}`,
                            '_blank'
                          )
                        }
                      >
                        Go to Incident
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        handleAcknowledge(device_id, incident_id, alarm_type)
                      }
                      className="acknowledge-btn"
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
