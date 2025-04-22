import { HvBreadCrumb } from "@hitachivantara/uikit-react-core";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../context/MyContext"; // adjust the path

const Breadcrumbs = () => {
  const { basename } = useContext(MyContext);
  const location = useLocation();
  console.log("Basename: "+JSON.stringify(basename)); // Debugging line

  const pathnames = location.pathname
    .replace(basename, "")
    .split("/")
    .filter((x) => x);
  console.log("Pathnames:"+JSON.stringify(pathnames)); // Debugging line
  const routes = [
    { label: "Operators Dashboard", path: `${basename}/` },
    ...pathnames.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      path: `${basename}/${pathnames.slice(0, index + 1).join("/")}`,
    })),
  ];

  return <HvBreadCrumb aria-label="Breadcrumb" listRoute={routes} maxVisible={routes.length} />;
};

export default Breadcrumbs;
