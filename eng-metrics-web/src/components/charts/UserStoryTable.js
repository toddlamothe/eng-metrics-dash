import React from 'react';
import { useEffect, useRef } from "react";
import '../../index.css';
import Container from "@mui/material/Container";
import {Toolbar, Typography} from '@mui/material';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import { useApiGet } from 'hooks/useApiGet';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';

const dataGridColumns = [
  { field: 'id', headerName: 'id', hide: true },
  { field: 'type', headerName: 'Type', width: 150,  },
  { field: 'summary', headerName: 'Summary', width: 500,  },
  { field: 'status', headerName: 'Status', width: 200 },
  { field: 'story_points', headerName: 'Points', width: 200 },
];

function UserStoryTable(props) {
  let showSpinner = useRef(true);

  const epicStoriesUri = 'https://ha4mv8svsk.execute-api.us-east-1.amazonaws.com/test-tl/epics/' + props.epicKey + '/stories';
  const epicStoriesData = useApiGet(epicStoriesUri);

  var dataGridRows = [];
  if (epicStoriesData.issues) {
    dataGridRows = epicStoriesData.issues.map( (issue) => {
      
      return {
        id: issue.id,
        type: issue.fields.issuetype ? issue.fields.issuetype.name : "Undefined",
        summary: issue.fields ? issue.fields.summary : "Summary not found",
        status: issue.fields.status ? issue.fields.status.name : "Status not found",
        story_points: issue.fields.customfield_10035 ? issue.fields.customfield_10035 : null
      }
    });    
  }

  useEffect( () => {
    showSpinner.current = false;
  }, [epicStoriesData])

  return (
    <>
      { showSpinner.current &&      
        <div className='spinner-style'>
          <CircularProgress />
        </div>
      }    
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
          <Grid minHeight={450} minWidth="100%" item xs={2} md={2} lg={2}>
            <DataGrid
              rows={dataGridRows}
              columns={dataGridColumns}
              pageSize={50}
              rowsPerPageOptions={[50]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

// Memoize the component so it doesn't re-render if the parent 
// re-renders but user story table props don't change
export default React.memo(UserStoryTable);