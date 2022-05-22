import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'id', hide: true },
  { field: 'backlog_id', headerName: 'backlog_id', hide: true },
  { field: 'release_name', headerName: 'Name', width: 200 },
  { field: 'release_description', headerName: 'Description', width: 300 },
  { field: 'epic_tag', headerName: 'Epic Tag', hide: true },
  { field: 'start_date', headerName: 'Start Date', hide: true },
];

function ReleaseList(props) {

  if (!props.releases) {
    return(
      <></>
    )
  }

  const dataGridRows = props.releases.map( release => {
    return {
      id: release.uuid,
      backlog_id: release.backlog_id,
      release_name : release.release_name,
      release_description : release.release_description,
      epic_tag : release.epic_tag,
      start_date : release.start_date
    }
  })

  const onReleaseSelected = (event) => {
    if (event.row && event.row.backlog_id) {
      props.onReleaseSelected(event.row);
    }
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={dataGridRows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick = { onReleaseSelected }
      />
    </div>
  );
}

export default ReleaseList;