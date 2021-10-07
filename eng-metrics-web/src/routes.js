// core components
import Dashboard from "views/admin/Dashboard.js";
import Map from "@material-ui/icons/Map";
import BarChart from "@material-ui/icons/BarChart";
import Storage from "@material-ui/icons/Storage";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: BarChart,
    iconColor: "Primary",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/index",
    name: "Accelerator",
    icon: Map,
    iconColor: "Primary",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/index",
    name: "Beacon",
    icon: Storage,
    iconColor: "Primary",
    component: Dashboard,
    layout: "/admin",
  }
];
export default routes;
