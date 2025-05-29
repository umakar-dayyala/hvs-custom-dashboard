import { HvBreadCrumb } from "@hitachivantara/uikit-react-core";
import { useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const { pathname, search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const floorLabel = decodeURIComponent(searchParams.get("floor") || "");

  const pathnames = pathname.split("/").filter(Boolean);

  const routes = [
    { label: "Summary Dashboard", path: "/" },
    ...pathnames.map((seg, idx) => {
      const path = `/${pathnames.slice(0, idx + 1).join("/")}`;

      // Custom label logic
      let label;
      if (seg === "floorwise" && floorLabel) {
        label = floorLabel;
      } else if (seg === "allalerts") {
        label = "All alarms and alerts";
      } else {
        label = seg.replace(/^\w/, c => c.toUpperCase());
      }

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