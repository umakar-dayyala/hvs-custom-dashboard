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
    if (/Individual$/i.test(segment)) {
      // Remove 'Individual' and convert the rest to uppercase
      return segment.replace(/Individual$/i, "").toUpperCase();
    }
    // Capitalize first letter of each word
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const routes = [
    { label: "Operators Dashboard", path: "/" },
    {
      label: floorLabel,
      path: `/floorwise${floorQueryParam}`,
    },
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
