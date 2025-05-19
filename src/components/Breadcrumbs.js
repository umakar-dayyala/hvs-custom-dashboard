import { HvBreadCrumb } from "@hitachivantara/uikit-react-core";
import { useLocation } from "react-router-dom";
 
const Breadcrumbs = () => {
  const { pathname, search } = useLocation();
 
  const searchParams = new URLSearchParams(search);
  const floorLabel = decodeURIComponent(searchParams.get("floor") || "");
 
  const pathnames = pathname.split("/").filter(Boolean);
 
  const routes = [
    { label: "Operators Dashboard", path: "/" },
    ...pathnames.map((seg, idx) => {
      const path = `/${pathnames.slice(0, idx + 1).join("/")}`;
 
      // if the segment is "floorwise" and a ?floor=… is present,
      // use the floor name instead of the segment itself
      const label =
        seg === "floorwise" && floorLabel ? floorLabel : seg.replace(/^\w/, c => c.toUpperCase());
 
      return { label, path };
    }),
  ];
 
  return (
    <HvBreadCrumb
      aria-label="Breadcrumb"
      listRoute={routes}
      maxVisible={routes.length}
    />
  );
};
 
export default Breadcrumbs;
 