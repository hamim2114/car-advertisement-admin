import { Box, Typography } from '@mui/material';
import React from 'react'
import DataTable from '../../common/DataTable';
import { Link } from 'react-router-dom';

const TopPerformLinks = ({data}) => {
  const topLinksColumns = [
    {
      field: 'slug',
      headerName: 'Slug',
      flex: 1,
      renderCell: (params) => (
        <Link
          to={`redirect-links/${params.value}`}
          style={{
            textDecoration: 'none',
            color: '#1976d2',
            fontWeight: 500
          }}
        >
          {params.value}
        </Link>
      )
    },
    {
      field: 'destinationUrl',
      headerName: 'Destination',
      flex: 2,
      renderCell: (params) => (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {params.value}
        </div>
      )
    },
    {
      field: 'visits',
      headerName: 'Visits',
      flex: 1,
      align: 'right',
      headerAlign: 'right'
    }
  ];
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Top Performing Links
        </Typography>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataTable
            rows={data || []}
            columns={topLinksColumns}
            getRowId={(row) => row._id}
            disableRowSelectionOnClick
          />
        </Box>
    </Box>
  )
}

export default TopPerformLinks