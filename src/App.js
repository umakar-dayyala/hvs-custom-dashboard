import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HvProvider, HvContainer } from "@hitachivantara/uikit-react-core";
import { AlertProvider } from "./context/AlertContext";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import IBACSensor from "./pages/IBACSensorDashboard";
import AGMSensorDashboard from "./pages/AGMSensorDashboard";
import AP4CSensorDashboard from "./pages/AP4CSensorDashboard";
import IBACparameterSettings from "./pages/IBACparamSettings";
import FloorMenu from "./components/FloorMenu";
import AlertBanner from "./components/AlertBanner";
import OperatorsDashboard from "./pages/OperatorsDashboard";
import FloorWiseDashboard from "./pages/FloorWiseDashboard";
import AllAlertsDashboard from "./pages/AllAlertsDashboard";
import { IbacIndividual } from "./pages/IbacIndividual";
import {AgmIndividual} from "./pages/agmIndividual"; // for agm sensor
import Breadcrumbs from "./components/Breadcrumbs";
import SensorLegend from "./components/SensorLegend";
import ToggleButtons from "./components/ToggleButtons";
import SensorStatusCards from "./components/SensorStatusCards";
import { MyProvider } from "./context/MyContext";
import { VRMIndividual } from "./pages/VRMIndividual";
import { PRMIndividual } from "./pages/PRMIndividual";
import { AP4CIndividual } from "./pages/AP4CIndividual";
import { MABIndividual } from "./pages/MABIndividual";
import { WRMIndividual } from "./pages/WRMIndividual";
import ChartDemo from "./components/chartDemo";
import Loader from "./components/Loader";
import WeatherDashboard from "./pages/weatherDashboard";
import Weatherv2 from "./pages/Weatherv2";
import FloorWiseAlarms from "./pages/FloorWiseAlarms";







const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <MyProvider>
    <HvProvider >
      <AlertProvider>
        <Router>
          <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
          <FloorMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          <HvContainer>
          {/* <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Breadcrumbs />
            <div style={{ display: "flex", gap: "10px" }}>
              <SensorLegend />
              <ToggleButtons />
            </div>
          </div> */}
          {/* <div style={{ marginTop: "16px" }}>
            <SensorStatusCards />
          </div> */}
          <AlertBanner />
            <Routes>
              <Route path="/" element={<OperatorsDashboard />} />
              <Route path="/ibacSensor" element={<IBACSensor />} />
              <Route path="/AGMSensor" element={<AGMSensorDashboard />} />
              <Route path="/ibacparamSettings" element={<IBACparameterSettings />} />
              <Route path="/ap4c-fsensor" element={<AP4CSensorDashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/floorwise" element={<FloorWiseDashboard />} />
              <Route path="/allalerts" element={<AllAlertsDashboard />} />
              <Route path="/ibacIndividual" element={<IbacIndividual/>} />
              <Route path="/vrmIndividual" element={<VRMIndividual/>}/>
              <Route path="/PRMIndividual" element={<PRMIndividual/>}/>
              <Route path="/AP4CIndividual" element={<AP4CIndividual/>}/>
              <Route path="/MABIndividual" element={<MABIndividual/>}/>
              <Route path="/agmindividual" element={<AgmIndividual/>}/>
              <Route path="/wrmIndividual" element={<WRMIndividual/>}/>
              {/* <Route path="/chartDemo" element={<ChartDemo/>} /> */}
              <Route path="/weather" element={<WeatherDashboard />} />
              <Route path="/Weatherv2" element={<Weatherv2 />} />
              <Route path="/floorwisealarms" element={<FloorWiseAlarms />} />
             
            </Routes>
          </HvContainer>
        </Router>
      </AlertProvider>
    </HvProvider>
    </MyProvider>
  );
};

export default App;