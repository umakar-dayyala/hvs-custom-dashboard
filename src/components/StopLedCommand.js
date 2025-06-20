// service/stopLedService.js
import { getStopParamId } from "../utils/stopParamCatalog";
import { sendParams } from "../service/ConfigurationPageService";

/**
 * Send the Stop LED/Buzzer command for a given device/sensor
 * @param {Object} opts - Required info for sending the command
 * @param {string|number} opts.device_id
 * @param {string} opts.ip
 * @param {string|number} opts.port
 * @param {string} opts.sensor_name
 */
export const sendStopLedCommand = async ({ device_id, ip, port, sensor_name }) => {
    const paramId = getStopParamId(sensor_name);

    if (!paramId) {
        throw new Error(`No stop parameter ID defined for sensor: ${sensor_name}`);
    }

    const payload = {
        type: 2,
        device_id,
        ip_address: ip,
        port,
        sensor_name,
        transaction_id: Date.now().toString(),
        data: {
            [paramId]: "1"
        }
    };

      return await sendParams(payload);
    // console.log("📦 Stop LED/Buzzer command payload that would be sent:", payload);
};
