import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SettingsIcon from '@mui/icons-material/Settings';
import NewReleases from '@mui/icons-material/NewReleases';
import {
  Switch,
  Route,
  Link,
} from "react-router-dom";

export const mainListItems = (
    <React.Fragment>        
        <ListSubheader component="div" inset>
          Main Menu
        </ListSubheader>    
        <ListItemButton>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>          
          <Link to="/release-admin">Release Admin</Link>
        </ListItemButton>        
      </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Admin
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <NewReleases />
      </ListItemIcon>
      <ListItemText primary="Manage Releases" />
    </ListItemButton>    
  </React.Fragment>
);

export const generateSecondaryListItems = (releases) => {
  return(
    <div>
      <ListSubheader component="div" inset>
        Releases
      </ListSubheader>
      {
        releases.map( (release) => {
          console.log("hello!");
          return(
            <React.Fragment>
              <ListItemButton>
                <ListItemIcon>
                  <NewReleases />
                </ListItemIcon>
                  <div key={release.uuid}>
                      <Link to={{
                        pathname : "/release-dashboard",
                        state : {
                          "release" : release
                          }
                        }} >{release.release_name}</Link>
                    </div>                
              </ListItemButton>    
            </React.Fragment>
          )
        })      
      }      
    </div>

  );
}