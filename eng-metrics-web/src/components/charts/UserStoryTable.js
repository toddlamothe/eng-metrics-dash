import React from 'react';
import '../../index.css';
import Container from "@mui/material/Container";
import {Toolbar, Typography} from '@mui/material';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';

export function UserStoryTable(props) {

  return (
    <>
      <Container
        maxWidth={false}
        component={Box}
      >
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            {props.epicKey} - {props.epicName}
          </Typography>
        </Toolbar>
        <Grid container spacing={1}>
          <Grid item xs={2} md={2} lg={2}>
            Table goes here
          </Grid>
        </Grid>

      </Container>
    </>
  );
}