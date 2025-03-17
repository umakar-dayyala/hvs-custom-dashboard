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
import Breadcrumbs from "./components/Breadcrumbs";
import SensorLegend from "./components/SensorLegend";
import ToggleButtons from "./components/ToggleButtons";
import SensorStatusCards from "./components/SensorStatusCards";


const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HvProvider >
      <AlertProvider>
        <Router>
          <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
          <FloorMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          <HvContainer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Breadcrumbs />
            <div style={{ display: "flex", gap: "10px" }}>
              <SensorLegend />
              <ToggleButtons />
            </div>
          </div>
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
            </Routes>
          </HvContainer>
        </Router>
      </AlertProvider>
    </HvProvider>
  );
};

export default App;