import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useApiGet } from '../hooks/useApiGet';

const columns = [
  { field: 'id', headerName: 'id', hide: true },
  { field: 'backlog_id', headerName: 'backlog_id', hide: true },
  { field: 'release_name', headerName: 'Name', width: 200 },
  { field: 'release_description', headerName: 'Description', width: 300 },
  { field: 'epic_tag', headerName: 'Epic Tag', hide: true },
];


export default function DataTable(props) {
  const releasesUrl = "https://ha4mv8svsk.execute-api.us-east-1.amazonaws.com/test-tl/releases";
  const rows =  useApiGet(releasesUrl);
  const dataGridRows = rows.map( release => {
    return {
      id: release.uuid,
      backlog_id: release.backlog_id,
      release_name : release.release_name,
      release_description : release.release_description,
      epic_tag : release.epic_tag
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
