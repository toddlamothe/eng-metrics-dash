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
    path: "/mapsearch",
    name: "Map Search",
    icon: Map,
    iconColor: "Primary",
    layout: "/admin",
    backlogId: 23
  },
  {
    path: "/beacon4ops",
    name: "Beacon for Ops",
    icon: Storage,
    iconColor: "Primary",
    layout: "/admin",
    backlogId: 32
  },
  {
    path: "/leadframework",
    name: "Lead/CRM Framework",
    icon: Storage,
    iconColor: "Primary",
    layout: "/admin",
    backlogId: 48
  }
];
export default routes;
