import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { SearchableTable } from '../components/TableComponentConfig';
import {
  fetchConfigurationData,
  fetchSensorStatusData,
  fetchStopLedAckData
} from '../service/ConfigurationPageService';

const ConfigurationPage = () => {
  const [generalData, setGeneralData] = useState([]);
  const [stopLedData, setStopLedData] = useState([]);
  const [sensorStatusData, setSensorStatusData] = useState([]);

  const [loading, setLoading] = useState({
    general: true,
    stopLed: true,
    sensorStatus: true,
    predictive: true
  });

  // ✅ Fetch for Configure Sensor and Predictive
  const loadGeneralData = async () => {
    setLoading(prev => ({ ...prev, general: true, predictive: true }));
    try {
      const res = await fetchConfigurationData();
      const formatted = res.data.map(item => ({
        staticPort: item.staticPort,
        static_type_flag: item.static_type_flag,
        staticIp: item.staticIp,
        device_id: item.device_id,
        floor: item.floor,
        zone: item.zone,
        location: item.location,
        type: item.sensor_type,
        sensor: item.sensor,
        action: item.action
      }));
      setGeneralData(formatted);
    } catch (err) {
      console.error("Error loading general config:", err);
    } finally {
      setLoading(prev => ({ ...prev, general: false, predictive: false }));
    }
  };

  // ✅ Fetch for Stop LED/Buzzer
  const loadStopLedData = async () => {
    setLoading(prev => ({ ...prev, stopLed: true }));
    try {
      const res = await fetchStopLedAckData();
      const formatted = res.data.map(item => {
        const d = item.device_id;
        return {
          device_id: d.device_id,
          floor: d.floor,
          zone: d.zone,
          location: d.location,
          type: d.sensor_type,
          sensor: d.sensor,
          staticIp: d.static_ip,
          staticPort: d.static_port,
          alarm_status: d.alarm_staus || "N/A",
          alarm_start: d.alarm_start,
          ack_at: d.ack_at,
          action: d.action,
        };
      });
      setStopLedData(formatted);
    } catch (err) {
      console.error("Error loading stop LED data:", err);
    } finally {
      setLoading(prev => ({ ...prev, stopLed: false }));
    }
  };

  // ✅ Fetch for Activate/Deactivate
  const loadSensorStatusData = async () => {
    setLoading(prev => ({ ...prev, sensorStatus: true }));
    try {
      const res = await fetchSensorStatusData();
      const formatted = res.data.map(item => ({
        device_id: item.device_id,
        floor: item.floor,
        zone: item.zone,
        location: item.location,
        type: item.sensor_type,
        sensor: item.sensor_name,
        sensor_status: item.sensor_status
      }));
      setSensorStatusData(formatted);
    } catch (err) {
      console.error("Error loading sensor status:", err);
    } finally {
      setLoading(prev => ({ ...prev, sensorStatus: false }));
    }
  };

  useEffect(() => {
    loadStopLedData();
    loadGeneralData();
    loadSensorStatusData();
  }, []);

  return (
    <div>
      <Box mt={2} mb={2}>
        <SearchableTable
          tableData={stopLedData}
          title="Stop LED/Buzzer"
          refreshData={loadStopLedData}
          loading={loading.stopLed}
        />
      </Box>

      <Box mt={2} mb={2}>
        <SearchableTable
          tableData={generalData}
          title="Configure Sensor"
          refreshData={loadGeneralData}
          loading={loading.general}
        />
      </Box>

      <Box mt={2} mb={2}>
        <SearchableTable
          tableData={sensorStatusData}
          title="Activate/Deactivate Sensor"
          refreshData={loadSensorStatusData}
          loading={loading.sensorStatus}
        />
      </Box>

      <Box mt={2} mb={2}>
        <SearchableTable
          tableData={generalData}
          title="Enable/Disable Predictive Analytics"
          refreshData={loadGeneralData}
          loading={loading.predictive}
        />
      </Box>
    </div>
  );
};

export default ConfigurationPage;