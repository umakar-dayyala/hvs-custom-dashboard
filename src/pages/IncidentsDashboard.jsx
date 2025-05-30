import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { isEqual } from "lodash";

import { floorList, summaryData } from "../service/summaryServices";
import HorizontalDivider from "../components/HorizontalDivider";
import Loader from "../components/Loader";
import SummaryCards from "../components/SummaryCards";
import IncidentMap from "../components/IncidentMap";
import IncidentAlertPanal from "../components/IncidentAlertPanal";
import PrintView from "../components/PrintView";
import SunburstChart from "../components/SunburstChart";


const IncidentDashboard = () => {
  const [floorData, setFloorData] = useState([]);
  const [sensorSummaryData, setSensorSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let timeout;
    let isFirstLoad = true;

    const fetchData = async () => {
      if (isFirstLoad) setLoading(true);

      try {
        const response = await floorList();
        const isChanged = !isEqual(response, floorData);
        if (isChanged) setFloorData(response);

        const data = await summaryData();
        const isDataChanged = !isEqual(data, sensorSummaryData);
        if (isDataChanged) setSensorSummaryData(data);
      } catch (error) {
        console.error("Error fetching floor data:", error);
      } finally {
        if (isMounted) {
          if (isFirstLoad) {
            setLoading(false);
            isFirstLoad = false;
          }
          timeout = setTimeout(fetchData, 500);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const handleTabClick = (floorName) => {
    navigate(`floorwise?floor=${floorName}`);
  };
  const incidentData = [
    {"s_no":{"s_no":1,"device_id":1168,"alarm_status":"No Alarm","zone":"1","location":"At Makar Dwar (Left side)","detector_type":"Radiation","detector":"PRM","status":"Active","last_updated":"2025-05-14 15:55:48.393","alarm_start_timestamp":null}},
    {"s_no":{"s_no":2,"device_id":49,"alarm_status":"Alarm","zone":"1","location":"At Makar Dwar (Right side)","detector_type":"Radiation","detector":"AGM","status":"Active","last_updated":"2025-05-14 15:55:48.400","alarm_start_timestamp":"2025-05-14T15:55:48.400Z"}},
    {"s_no":{"s_no":3,"device_id":1159,"alarm_status":"No Alarm","zone":"2","location":"Near Control Room","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.410","alarm_start_timestamp":null}},
    {"s_no":{"s_no":4,"device_id":15,"alarm_status":"No Alarm","zone":"2","location":"Behind Main Gate","detector_type":"Radiation","detector":"PRM","status":"Active","last_updated":"2025-05-14 15:55:48.420","alarm_start_timestamp":null}},
    {"s_no":{"s_no":5,"device_id":16,"alarm_status":"No Alarm","zone":"2","location":"Hans Dwar (Right side)","detector_type":"Biological","detector":"IBAC","status":"Active","last_updated":"2025-05-14 15:55:48.430","alarm_start_timestamp":null}},
    {"s_no":{"s_no":6,"device_id":81,"alarm_status":"No Alarm","zone":"3","location":"Zone 3 Entrance","detector_type":"Chemical","detector":"AP4C","status":"Active","last_updated":"2025-05-14 15:55:48.440","alarm_start_timestamp":null}},
    {"s_no":{"s_no":7,"device_id":2186,"alarm_status":"Alarm","zone":"3","location":"Zone 3 Hallway","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.450","alarm_start_timestamp":"2025-05-14T15:55:48.450Z"}},
    {"s_no":{"s_no":8,"device_id":3,"alarm_status":"Alarm","zone":"3","location":"Zone 3 Hallway","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.460","alarm_start_timestamp":"2025-05-14T15:55:48.460Z"}},
    {"s_no":{"s_no":9,"device_id":65,"alarm_status":"No Alarm","zone":"4","location":"West Wing Corridor","detector_type":"Radiation","detector":"PRM","status":"Active","last_updated":"2025-05-14 15:55:48.470","alarm_start_timestamp":null}},
    {"s_no":{"s_no":10,"device_id":146,"alarm_status":"No Alarm","zone":"4","location":"West Wing Corridor","detector_type":"Radiation","detector":"PRM","status":"Active","last_updated":"2025-05-14 15:55:48.480","alarm_start_timestamp":null}},
    {"s_no":{"s_no":11,"device_id":2187,"alarm_status":"Alarm","zone":"4","location":"South Gate","detector_type":"Radiation","detector":"AGM","status":"Active","last_updated":"2025-05-14 15:55:48.490","alarm_start_timestamp":"2025-05-14T15:55:48.490Z"}},
    {"s_no":{"s_no":12,"device_id":33,"alarm_status":"No Alarm","zone":"3","location":"At Garuda Dwar (Right side)","detector_type":"Biological","detector":"MAB","status":"Active","last_updated":"2025-05-14 15:55:48.500","alarm_start_timestamp":null}},
    {"s_no":{"s_no":13,"device_id":145,"alarm_status":"No Alarm","zone":"4","location":"South Wing","detector_type":"Radiation","detector":"AGM","status":"Active","last_updated":"2025-05-14 15:55:48.510","alarm_start_timestamp":null}},
    {"s_no":{"s_no":14,"device_id":34,"alarm_status":"No Alarm","zone":"4","location":"South Wing","detector_type":"Radiation","detector":"PRM","status":"Active","last_updated":"2025-05-14 15:55:48.520","alarm_start_timestamp":null}},
    {"s_no":{"s_no":15,"device_id":53,"alarm_status":"No Alarm","zone":"4","location":"Utility Room","detector_type":"Chemical","detector":"AP4C","status":"Active","last_updated":"2025-05-14 15:55:48.530","alarm_start_timestamp":null}},
    {"s_no":{"s_no":16,"device_id":113,"alarm_status":"Alarm","zone":"4","location":"Utility Room","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.540","alarm_start_timestamp":"2025-05-14T15:55:48.540Z"}},
    {"s_no":{"s_no":17,"device_id":1171,"alarm_status":"No Alarm","zone":"4","location":"Utility Room","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.550","alarm_start_timestamp":null}},
    {"s_no":{"s_no":18,"device_id":35,"alarm_status":"No Alarm","zone":"4","location":"South Exit","detector_type":"Radiation","detector":"PRM","status":"Active","last_updated":"2025-05-14 15:55:48.560","alarm_start_timestamp":null}},
    {"s_no":{"s_no":19,"device_id":2188,"alarm_status":"Alarm","zone":"4","location":"Server Room","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.570","alarm_start_timestamp":"2025-05-14T15:55:48.570Z"}},
    {"s_no":{"s_no":20,"device_id":66,"alarm_status":"No Alarm","zone":"4","location":"Server Room","detector_type":"Biological","detector":"IBAC","status":"Active","last_updated":"2025-05-14 15:55:48.580","alarm_start_timestamp":null}},
    {"s_no":{"s_no":21,"device_id":2189,"alarm_status":"No Alarm","zone":"4","location":"Server Room","detector_type":"Chemical","detector":"AP4C","status":"Active","last_updated":"2025-05-14 15:55:48.590","alarm_start_timestamp":null}},
    {"s_no":{"s_no":22,"device_id":36,"alarm_status":"No Alarm","zone":"4","location":"Server Room","detector_type":"Radiation","detector":"PRM","status":"Active","last_updated":"2025-05-14 15:55:48.600","alarm_start_timestamp":null}},
    {"s_no":{"s_no":23,"device_id":2190,"alarm_status":"No Alarm","zone":"4","location":"Server Room","detector_type":"Radiation","detector":"AGM","status":"Active","last_updated":"2025-05-14 15:55:48.610","alarm_start_timestamp":null}},
    {"s_no":{"s_no":24,"device_id":90,"alarm_status":"No Alarm","zone":"4","location":"Server Room","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.620","alarm_start_timestamp":null}},
    {"s_no":{"s_no":25,"device_id":67,"alarm_status":"No Alarm","zone":"5","location":"Zone 5 Hallway","detector_type":"Radiation","detector":"PRM","status":"Active","last_updated":"2025-05-14 15:55:48.630","alarm_start_timestamp":null}},
    {"s_no":{"s_no":26,"device_id":37,"alarm_status":"Alarm","zone":"5","location":"Zone 5 Hallway","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.640","alarm_start_timestamp":"2025-05-14T15:55:48.640Z"}},
    {"s_no":{"s_no":27,"device_id":50,"alarm_status":"Alarm","zone":"RS Chamber","location":"Inside RS Chamber","detector_type":"Chemical","detector":"AP4C-F","status":"Active","last_updated":"2025-05-14 15:55:48.389","alarm_start_timestamp":"2025-05-14T15:55:48.389Z"}},
    {"s_no":{"s_no":28,"device_id":2191,"alarm_status":"No Alarm","zone":"5","location":"Storage Area","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.650","alarm_start_timestamp":null}},
    {"s_no":{"s_no":29,"device_id":2192,"alarm_status":"No Alarm","zone":"5","location":"Storage Area","detector_type":"Chemical","detector":"AP4C","status":"Active","last_updated":"2025-05-14 15:55:48.660","alarm_start_timestamp":null}},
    {"s_no":{"s_no":30,"device_id":3184,"alarm_status":"No Alarm","zone":"5","location":"Storage Area","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.670","alarm_start_timestamp":null}},
    {"s_no":{"s_no":31,"device_id":3185,"alarm_status":"No Alarm","zone":"5","location":"Storage Area","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.680","alarm_start_timestamp":null}},
    {"s_no":{"s_no":32,"device_id":68,"alarm_status":"No Alarm","zone":"5","location":"Storage Area","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.690","alarm_start_timestamp":null}},
    {"s_no":{"s_no":33,"device_id":3183,"alarm_status":"No Alarm","zone":"5","location":"Storage Area","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.700","alarm_start_timestamp":null}},
    {"s_no":{"s_no":34,"device_id":3186,"alarm_status":"No Alarm","zone":"5","location":"Storage Area","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.710","alarm_start_timestamp":null}},
    {"s_no":{"s_no":35,"device_id":69,"alarm_status":"No Alarm","zone":"5","location":"Storage Area","detector_type":"Chemical","detector":"FCAD","status":"Active","last_updated":"2025-05-14 15:55:48.720","alarm_start_timestamp":null}}
]
 

  return (
    <>
      {/* {loading && <Loader />} */}
      <Box >
        {/* Sticky Header Section */}
        <Box >
          <Box p={1}>
            <SummaryCards />
          </Box>
          <HorizontalDivider />
        </Box>
        

        {/* Main Content: Map + Alert Panel */}
        <Box display="flex" px={2} py={2} gap={2} alignItems="flex-start" flex={1}>
          {/* Incident Map Section */}
          <Box flex={1} minWidth={0}>
            <IncidentMap sensorData={incidentData} />
          </Box>

          {/* Alert Panel Section */}
          <Box width="25%" minWidth="280px">
            <IncidentAlertPanal />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default IncidentDashboard;
