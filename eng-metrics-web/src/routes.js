// core components
import Map from "@mui/icons-material/Map";
import BarChart from "@mui/icons-material/BarChart";
import Storage from "@mui/icons-material/Storage";

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
