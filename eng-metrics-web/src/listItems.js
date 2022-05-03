import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SettingsIcon from '@mui/icons-material/Settings';
import StackedBarChart from '@mui/icons-material/StackedBarChart';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";

export const mainListItems = (
    <React.Fragment>
        <ListItemButton>
          <Link to="/release-admin">
            <Typography variant="h6" component="div">
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              Release Admin
            </Typography>
          </Link>
        </ListItemButton>
        <ListItemButton>
          <Link to="/test-component">
              <Typography variant="h6" component="div">
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                Test Component
              </Typography>
            </Link>
        </ListItemButton>
      </React.Fragment>
);

export const generateSecondaryListItems = (releases) => {
  return(
    <div>
      <ListSubheader component="div" inset>
        <Typography variant="h6" component="div">Releases</Typography>
      </ListSubheader>
      {
        releases.map( (release) => {
          return(
            <React.Fragment key={release.uuid}>
              <ListItemButton>                  
                <Link to={{
                  pathname : "/release-dashboard",
                  state : {
                    "release" : release
                    }
                  }} >
                    <Typography 
                      component="h1"
                      variant="h6"
                      color="inherit"
                      noWrap
                      sx={{ flexGrow: 1 }}>
                        <ListItemIcon><StackedBarChart /></ListItemIcon>
                        {release.release_name}
                    </Typography>                    
                </Link>
              </ListItemButton>
            </React.Fragment>
          )
        })
      }
    </div>
  );
}