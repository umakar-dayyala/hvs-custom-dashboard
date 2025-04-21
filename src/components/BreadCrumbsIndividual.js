import { HvBreadCrumb } from "@hitachivantara/uikit-react-core";
import { useLocation } from "react-router-dom";

const BreadCrumbsIndividual = ({ locationDetails }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const floorLabel = locationDetails?.floor || "Floor";
  const floorQueryParam = locationDetails?.floor
    ? `?floor=${encodeURIComponent(locationDetails.floor)}`
    : "";

  const routes = [
    { label: "Operators Dashboard", path: "/" },
    {
      label: floorLabel,
      path: `/floorwise${floorQueryParam}`,
    },
    ...pathnames.map((path, index) => ({
      label: decodeURIComponent(path.charAt(0).toUpperCase() + path.slice(1)),
      path: `/${pathnames.slice(0, index + 1).join("/")}`,
    })),
  ];

  return <HvBreadCrumb aria-label="Breadcrumb" listRoute={routes} maxVisible={routes.length} />;
};

export default BreadCrumbsIndividual;
