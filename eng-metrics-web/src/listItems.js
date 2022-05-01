import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SettingsIcon from '@mui/icons-material/Settings';
import NewReleases from '@mui/icons-material/NewReleases';
import Typography from '@mui/material/Typography';
import {
  Switch,
  Route,
  Link,
} from "react-router-dom";

export const mainListItems = (
    <React.Fragment>        
        <ListSubheader component="div" inset>
        <Typography variant="h6" component="div">Main Menu</Typography>
        </ListSubheader>
        <ListItemButton>
          <Link to="/release-admin">            
            <Typography variant="h6" component="div">
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              Release Admin
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
            <React.Fragment>
              <ListItemButton>
                  <div key={release.uuid}>                    
                      <Link to={{
                        pathname : "/release-dashboard",
                        state : {
                          "release" : release
                          }
                        }} >                          
                          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <ListItemIcon><NewReleases /></ListItemIcon>
                            {release.release_name}
                          </Typography>                          
                        </Link>
                    </div>                
              </ListItemButton>    
            </React.Fragment>
          )
        })      
      }      
    </div>

  );
}