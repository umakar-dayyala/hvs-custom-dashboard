/* paramCatalog.js -------------------------------------------------------- */

/**
 * Map <sensor_name> ➜ array of parameters for that sensor.
 * Keep every sensor in a single file so it stays the “single source of truth”.
 */
export const sensorParamCatalog = {
  agm: [
    { id: 10, label: "Load Default Settings" },
    { id: 11, label: "Acknowledge" },
    { id: 12, label: "Reset" },
    { id: 13, label: "RESET MODE" },
    { id: 14, label: "Data Logging" },
    { id: 15, label: "Baudrate" },
    { id: 16, label: "Buzzer" },
    { id: 17, label: "Buzzer Tone" },
    { id: 26, label: "Alarm Level" },
    { id: 27, label: "Max Level" },
    { id: 28, label: "Min Level" },
    { id: 29, label: "Calibration Factor" },
    { id: 30, label: "Instrument Address" },
    { id: 31, label: "IP Address" },
    { id: 32, label: "Subnet Mask" },
    { id: 33, label: "Gateway" },
    { id: 34, label: "Date" },
    { id: 35, label: "Time" },
    { id: 36, label: "Audio Off Time" },
    { id: 37, label: "Dose Rate Unit" }
  ],

  ibac: [
    // example – replace with the real IBAC list
    { id: 1, label: "sensor_datetime" },
    { id: 24, label: "ip_address" },
    { id: 25, label: "network_mask" },
    { id: 26, label: "router_ip" },
    { id: 27, label: "alarm_function" },
    { id: 28, label: "alarm_criteria" },
    { id: 29, label: "alarm_reset" },
    { id: 30, label: "pump_status" },
    { id: 31, label: "auxiliary_status" },
    { id: 32, label: "auxiliary_alarm_status" },
    { id: 38, label: "trigger_simulated_alarm" },
    { id: 39, label: "nauto_collect" },
    { id: 40, label: "collect" },
  ],

  mab: [
     { id: 13, label: "waking_state" },
    { id: 17, label: "device_state" },
    
  ]
};

/* ----- helpers ---------------------------------------------------------- */

/** Return the catalog array for a sensor; empty array if unknown */
export const getParamCatalog = (sensorName = "") =>
  sensorParamCatalog[sensorName.toLowerCase()] ?? [];

/** Dict keyed by id for O(1) look-ups; built only once per sensor type */
export const catalogById = Object.fromEntries(
  Object.entries(sensorParamCatalog).map(([sensor, list]) => [
    sensor,
    list.reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {})
  ])
);
