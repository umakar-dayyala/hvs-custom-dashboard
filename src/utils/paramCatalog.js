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
    { id: 1, label: "Sensor Datetime" },
    { id: 24, label: "IP Address" },
    { id: 25, label: "Network Mask" },
    { id: 26, label: "Router IP" },
    { id: 27, label: "Alarm Function" },
    { id: 28, label: "Alarm Criteria" },
    { id: 29, label: "Alarm Reset" },
    { id: 30, label: "Pump Status" },
    { id: 31, label: "Auxiliary Status" },
    { id: 32, label: "Auxiliary Alarm Status" },
    { id: 38, label: "Trigger Simulated Alarm" },
    { id: 39, label: "Nauto Collect" },
    { id: 40, label: "collect" },
  ],

  mab: [
     { id: 14, label: "Waking State" },
    { id: 20, label: "Device State" },
    
  ],

  vrm:[
    { id: 25, label: "DET 1 STATUS" },
    { id: 26, label: "DET 2 STATUS" },
    { id: 36, label: "BGH1" },
    { id: 37, label: "BGL1" },
    { id: 38, label: "BGA1"},
    { id: 39, label: "BGH2"},
    { id: 40, label: "BGL2"},
    { id: 41, label: "BGA2"},
    { id: 60, label: "ACK"},
    { id: 79, label: "DATETIME" },
  ],

  prm:[
    { id: 1, label: "DET 1 COUNTS " },
    { id: 3, label: "DET 1 STAT " },
    { id: 11, label: "DET 1 BGHIGH " },
    { id: 12, label: "DET 1 BGLOW " },
    { id: 13, label: "DET 1 ALARM "},
    { id: 17, label: "DATETIME"},
    { id: 21, label: "ACK"}
  ],

  wrm: [
   
    { id: 3, label: "DET 1 STAT " },
    { id: 4, label: "DET 2 STAT" },
    { id: 11, label: "DET 1 BGHIGH " },
    { id: 12, label: "DET 1 BGLOW " },
    { id: 13, label: "DET 1 ALARM "},
    { id: 14, label: "DET 2 BGHIGH " },
    { id: 15, label: "DET 2 BGLOW " },
    { id: 16, label: "DET 2 ALARM "},
    { id: 17, label: "DATETIME"},
    { id: 21, label: "ACK"}
  ],
  fcad:[
    { id: 8, label: "IP address" },
  ],

  aam:[
    { id: 44, label: "Reset Instrument" },
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
