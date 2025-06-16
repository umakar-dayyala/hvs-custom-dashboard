import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { SearchableTable } from '../components/TableComponentConfig';
import { fetchConfigurationData, fetchSensorStatusData } from '../service/ConfigurationPageService';

const stop_led_title = "Stop LED/Buzzer";
const Configuration_title = "Configure Sensor";
const active_dective_title = "Activate/Deactivate Sensor";
const predective_title = "Enable/Disable Predictive Analytics";

const ConfigurationPage = () => {
  const [tableData, setTableData] = useState({
    general: [],
    stopLed: [],
    sensorStatus: []
  });
  const [loadingStates, setLoadingStates] = useState({
    stopLed: true,
    general: true,
    sensorStatus: true,
    predictive: true
  });

  const fetchData = async (tableKey) => {
    setLoadingStates(prev => ({ ...prev, [tableKey]: true }));

    if (tableKey === 'stopLed' || tableKey === 'general' || tableKey === 'predictive') {
      try {
        const configRes = await fetchConfigurationData();
        const processedGeneralData = configRes.data.map(item => ({
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

        const stopLedData = configRes.data
          .filter(item => item.action === 1)
          .map(item => ({
            device_id: item.device_id,
            floor: item.floor,
            zone: item.zone,
            location: item.location,
            type: item.sensor_type,
            sensor: item.sensor,
            staticIp: item.staticIp,
            staticPort: item.staticPort,
            alarm_status: item.alarm_status || "N/A",
            action: item.action
          }));

        setTableData(prev => ({
          ...prev,
          general: tableKey === 'general' || tableKey === 'predictive' ? processedGeneralData : prev.general,
          stopLed: tableKey === 'stopLed' ? stopLedData : prev.stopLed
        }));
      } catch (err) {
        console.error("Error fetching configuration data:", err);
      } finally {
        setLoadingStates(prev => ({ ...prev, [tableKey]: false }));
      }
    } else if (tableKey === 'sensorStatus') {
      try {
        const sensorStatusRes = await fetchSensorStatusData();
        const predictiveData = sensorStatusRes.data.map(item => ({
          device_id: item.device_id,
          floor: item.floor,
          zone: item.zone,
          location: item.location,
          type: item.sensor_type,
          sensor: item.sensor_name,
          sensor_status: item.sensor_status
        }));

        setTableData(prev => ({
          ...prev,
          sensorStatus: predictiveData
        }));
      } catch (err) {
        console.error("Error fetching sensor status data:", err);
      } finally {
        setLoadingStates(prev => ({ ...prev, sensorStatus: false }));
      }
    }
  };

  useEffect(() => {
    fetchData('stopLed');
    fetchData('general');
    fetchData('sensorStatus');
    fetchData('predictive');
  }, []);

  return (
    <div>
      {/* Stop LED/Buzzer Table */}
      <Box mt={2} mb={2}>
        <SearchableTable
          tableData={tableData.stopLed}
          title={stop_led_title}
          refreshData={() => fetchData('stopLed')}
          loading={loadingStates.stopLed}
        />
      </Box>

      {/* Configure Sensor Table */}
      <Box mt={2} mb={2}>
        <SearchableTable
          tableData={tableData.general}
          title={Configuration_title}
          refreshData={() => fetchData('general')}
          loading={loadingStates.general}
        />
      </Box>

      {/* Activate/Deactivate Sensor Table */}
      <Box mt={2} mb={2}>
        <SearchableTable
          tableData={tableData.sensorStatus}
          title={active_dective_title}
          refreshData={() => fetchData('sensorStatus')}
          loading={loadingStates.sensorStatus}
        />
      </Box>

      {/* Enable/Disable Predictive Analytics Table */}
      <Box mt={2} mb={2}>
        <SearchableTable
          tableData={tableData.general}
          title={predective_title}
          refreshData={() => fetchData('predictive')}
          loading={loadingStates.predictive}
        />
      </Box>
    </div>
  );
};

export default ConfigurationPage;