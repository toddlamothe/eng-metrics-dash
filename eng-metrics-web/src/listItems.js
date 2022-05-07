import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Link } from "react-router-dom";

export const mainListItems = (
  <React.Fragment>    
      <ListItemButton component={Link} to="/release-admin">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Release Admin" />
      </ListItemButton>
  </React.Fragment>
);

export const generateSecondaryListItems = (releases) => (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Releases
    </ListSubheader>    {
        releases.map( (release) => {
          return(
            <Link key={release.uuid} to={{
              pathname : "/release-dashboard",
              state : {
                "release" : release
                }
              }} >
                <ListItemButton>
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary={release.release_name} />
                </ListItemButton>
            </Link>
          )
        })
      }
  </React.Fragment>
);