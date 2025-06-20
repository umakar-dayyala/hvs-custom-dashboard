// utils/stopParamCatalog.js

export const stopParamCatalog = {
    vrm: [{ id: 60, label: "ACK" }],
    prm: [{ id: 21, label: "ACK" }],
    wrm: [{ id: 21, label: "ACK" }],
    agm: [{ id: 11, label: "Acknowledge" }],
    ibac: [{ id: 29, label: "Alarm Reset" }],
  };
  
  /** Get stop parameter ID for a sensor type (returns the first one if found) */
  export const getStopParamId = (sensorName = "") => {
    const list = stopParamCatalog[sensorName.toLowerCase()];
    return list?.[0]?.id ?? null;
  };
  