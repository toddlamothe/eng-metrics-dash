import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Link from '@mui/material/Link';

// To Do: Replace this list with a dynamically-generated list of backlogs. Original dashboard example can be found at
// https://github.com/mui/material-ui/blob/master/docs/data/material/getting-started/templates/dashboard/Dashboard.js
export const mainListItems = (
    <React.Fragment>        
        <ListSubheader component="div" inset>
          Releases
        </ListSubheader>    
        <ListItemButton>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Test Release" />
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
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Manage Releases" />
    </ListItemButton>    
  </React.Fragment>
);