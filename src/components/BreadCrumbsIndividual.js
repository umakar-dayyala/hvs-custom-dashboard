import { HvBreadCrumb } from "@hitachivantara/uikit-react-core";
import { useLocation } from "react-router-dom";

const BreadCrumbsIndividual = ({ locationDetails }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const floorLabel = locationDetails?.floor || "Floor";
  const floorQueryParam = locationDetails?.floor
    ? `?floor=${encodeURIComponent(locationDetails.floor)}`
    : "";

  const formatLabel = (segment) => {
    // Special cases first
    if (segment === "allalerts") return "All alarms and alerts";
    if (segment === "weather") return "Weather Dashboard";
    
    // Handle specific device types
    if (/ibacIndividual$/i.test(segment)) {
      return "IBAC (FB1)";
    }
    if (/mabIndividual$/i.test(segment)) {
      return "MAB (FB2)";
    }
    if (/fcadIndividual$/i.test(segment)) {
      return "FCAD (FC1)";
    }
    if (/ap4cIndividual$/i.test(segment)) {
      return "AP4C - F (FC2)";
    }
    
    // Handle other 'Individual' suffixes
    if (/Individual$/i.test(segment)) {
      return segment.replace(/Individual$/i, "").toUpperCase();
    }
    
    // Default case - capitalize first letter of each word
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const routes = [
    { label: "Operators Dashboard", path: "/" },
    ...(pathnames[0] !== "floorwise" && floorLabel
      ? [{ label: floorLabel, path: `/floorwise${floorQueryParam}` }]
      : []),
    ...pathnames.map((segment, index) => ({
      label: formatLabel(segment),
      path: `/${pathnames.slice(0, index + 1).join("/")}`,
    })),
  ];

  return (
    <HvBreadCrumb
      aria-label="Breadcrumb"
      listRoute={routes}
      maxVisible={routes.length}
    />
  );
};

export default BreadCrumbsIndividual;