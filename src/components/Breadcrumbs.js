import { HvBreadCrumb } from "@hitachivantara/uikit-react-core";
import { useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const { pathname, search, state } = location;

  const searchParams = new URLSearchParams(search);
  const floorLabel = decodeURIComponent(searchParams.get("floor") || "");

  const pathnames = pathname.split("/").filter(Boolean);

  // Start with default
  const routes = [{ label: "Summary Dashboard", path: "/" }];

  // Check if navigating to Sensor Status and came from Incident
  if (pathnames.includes("sensorStatus")) {
    if (state?.from === "incident") {
      routes.push({ label: "Incident Dashboard", path: "/incidentDashboard" });
    }
    routes.push({ label: "Sensor Status", path: pathname });
  } else {
    // Default logic for everything else
    routes.push(
      ...pathnames.map((seg, idx) => {
        const path = `/${pathnames.slice(0, idx + 1).join("/")}`;
        let label;
        if (seg === "floorwise" && floorLabel) {
          label = floorLabel;
        } else if (seg === "allalerts") {
          label = "All alarms and alerts";
        } else if (seg === "sensorEventHistory") {
          label = "Historical Dashboard";
        } else if (seg === "inventory") {
          label = "Inventory Dashboard";
        } else {
          label = seg.replace(/^\w/, (c) => c.toUpperCase());
        }
        return { label, path };
      })
    );
  }

  return (
    <HvBreadCrumb
      aria-label="Breadcrumb"
      listRoute={routes}
      maxVisible={routes.length}
    />
  );
};

export default Breadcrumbs;