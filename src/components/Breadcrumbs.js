import { HvBreadCrumb } from "@hitachivantara/uikit-react-core";
import { useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const routes = pathnames.map((path, index) => {
    const routePath = `/${pathnames.slice(0, index + 1).join("/")}`;
    return {
      label: path.charAt(0).toUpperCase() + path.slice(1), // Capitalize first letter
      path: routePath,
    };
  });

  return <HvBreadCrumb aria-label="Breadcrumb" listRoute={routes} maxVisible={routes.length} />;
};

export default Breadcrumbs;
