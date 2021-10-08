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
    backlogId: 0
  },
  {
    path: "/accelerator",
    name: "Accelerator",
    icon: Map,
    iconColor: "Primary",
    component: <Dashboard backlogId="23" />,
    layout: "/admin",
    backlogId: 23
  },
  {
    path: "/beacon",
    name: "Beacon",
    icon: Storage,
    iconColor: "Primary",
    component: <Dashboard backlogId="32" />,
    layout: "/admin",
    backlogId: 32
  }
];
export default routes;
