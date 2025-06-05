import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { acknowledgeAlarm, getIncidentBySourceId, getRedisAlarms } from '../service/IncidentService';

const IncidentAlertPanal = ({ incidentData, ...props }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [incidentIds, setIncidentIds] = useState({}); // Store pk_inc_id for each deviceId

  const handleAcknowledge = async (deviceId) => {
    try {
      console.log('handleAcknowledge triggered for deviceId:', deviceId);
      const timestamp = new Date().toISOString();
      
      // Fetch Redis alarms to get incident_id
      const redisResponse = await getRedisAlarms();
      const alarm = redisResponse.devices.devices.find(alarm => alarm.device_id === deviceId);
      if (!alarm) {
        throw new Error(`No incident ID found for device ID: ${deviceId}`);
      }
      const uniqueId = alarm.incident_id;

      // Call the GET API to fetch pk_inc_id
      const incidentResponse = await getIncidentBySourceId(uniqueId, props.keycloak.idToken);
      const pkIncId = incidentResponse.data.pk_inc_id;
      
      // Store the pk_inc_id in state
      setIncidentIds((prev) => ({
        ...prev,
        [deviceId]: pkIncId,
      }));

      // Call existing acknowledgeAlarm API
      const message = await acknowledgeAlarm(deviceId, timestamp);
      console.log('Acknowledge success, setting snackbar:', message);
      setSnackbar({
        open: true,
        message: message,
        severity: 'success',
      });
    } catch (error) {
      console.error('Failed to acknowledge alarm or fetch incident:', error.message);
      setSnackbar({
        open: true,
        message: `Failed to acknowledge alarm: ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    console.log('Closing snackbar');
    setSnackbar({ ...snackbar, open: false });
  };

  const activeAlarms = incidentData?.filter(incident => incident?.s_no?.alarm_status !== "No Alarm") || [];

  return (
    <>
      <style>
        {`
          @keyframes blinkAlert {
            0% { background-color: white; }
            50% { background-color: red; color:white }
            100% { background-color: white; }
          }
          
          @keyframes blinkButton {
            0% { background-color: #333; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
            50% { background-color: #333; box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4), 0 0 20px rgba(211, 47, 47, 0.3); }
            100% { background-color: #333; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
          }
          
          .alert-card {
            animation: blinkAlert 2s infinite;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            padding: 16px;
            position: relative;
            width: 100%;
            border: 2px solid #ffcdd2;
            text-align: center;
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
          }
          
          .acknowledge-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(211, 47, 47, 0.5), 0 0 25px rgba(211, 47, 47, 0.4) !important;
          }
          
          .acknowledge-btn:active {
            transform: translateY(0);
          }
        `}
      </style>
      <div className={`alert-scroll ${activeAlarms.length === 0 ? 'no-alarm' : ''}`} style={{
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {activeAlarms.length > 0 ? (
          activeAlarms.map((incident) => (
            <div key={incident.s_no.device_id} className="alert-card" style={{
              animation: 'blinkAlert 2s infinite',
              borderRadius: '12px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              padding: '16px',
              position: 'relative',
              width: '100%',
              border: '2px solid #ffcdd2'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '26px',
                height: '14px',
                backgroundColor: '#ffcdd2',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                zIndex: 1
              }} />
              <h3 style={{ fontSize: '18px', margin: 0 }}>
                {incident.s_no.detector} Alarm - {incident.s_no.location || 'Unknown Location'}
              </h3>
              <p style={{ fontSize: '14px', margin: '8px 0' }}>
                Sensor Type: {incident.s_no.detector_type} | Status: {incident.s_no.alarm_status}
              </p>
              <button
                onClick={() => handleAcknowledge(incident.s_no.device_id)}
                className="acknowledge-btn"
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  backgroundColor: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '16px'
                }}>
                Acknowledge Alarm
              </button>
              <a
                href={incidentIds[incident.s_no.device_id] ? `https://devs.hitachivisualization.com/incidents/${incidentIds[incident.s_no.device_id]}` : '#'}
                className="acknowledge-btn"
                style={{
                  marginTop: '12px',
                  marginLeft: '30px',
                  padding: '8px 16px',
                  backgroundColor: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '16px',
                  textDecoration: 'none'
                }}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!incidentIds[incident.s_no.device_id]) {
                    e.preventDefault();
                    setSnackbar({
                      open: true,
                      message: 'Please acknowledge the alarm first to view the incident.',
                      severity: 'warning',
                    });
                  }
                }}>
                Go to Incident
              </a>
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '12px solid white',
                zIndex: 2,
              }} />
            </div>
          ))
        ) : (
          <div className="no-alarm-card" style={{
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            padding: '16px',
            position: 'relative',
            width: '100%',
            border: '2px solid green',
            minHeight: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '26px',
              height: '14px',
              backgroundColor: 'green',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              zIndex: 1
            }} />
            <h3 style={{ fontSize: '18px', margin: 0, color: '#666' }}>
              No Active Alarm
            </h3>
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '12px solid white',
              zIndex: 2
            }} />
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