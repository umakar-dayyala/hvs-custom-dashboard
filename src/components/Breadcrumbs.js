import { HvBreadCrumb } from "@hitachivantara/uikit-react-core";
import { useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const routes = [
    { label: "operatorsdashboard", path: "/" }, // Always include Homepage
    ...pathnames.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      path: `/${pathnames.slice(0, index + 1).join("/")}`,
    })),
  ];

  return <HvBreadCrumb aria-label="Breadcrumb" listRoute={routes} maxVisible={routes.length} />;
};

export default Breadcrumbs;
