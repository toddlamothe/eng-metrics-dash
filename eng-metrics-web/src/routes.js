// core components
import Map from "@material-ui/icons/Map";
import BarChart from "@material-ui/icons/BarChart";
import Storage from "@material-ui/icons/Storage";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: BarChart,
    iconColor: "Primary",
    layout: "/admin",
    backlogId: 0
  },
  {
    path: "/accelerator",
    name: "Accelerator",
    icon: Map,
    iconColor: "Primary",
    layout: "/admin",
    backlogId: 23
  },
  {
    path: "/beacon",
    name: "Beacon",
    icon: Storage,
    iconColor: "Primary",
    layout: "/admin",
    backlogId: 32
  }
];
export default routes;
