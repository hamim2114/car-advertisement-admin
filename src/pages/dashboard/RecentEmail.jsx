import { Box, Typography } from '@mui/material'
import React from 'react'
import DataTable from '../../common/DataTable'
import { Link } from 'react-router-dom';

const RecentEmail = ({ data }) => {
  const emailsColumns = [
    {
      field: 'email',
      headerName: 'Email',
      flex: 2
    },
    {
      field: 'link',
      headerName: 'Link',
      flex: 1,
      renderCell: (params) => (
        <Link
          to={`redirect-links/${params.value.slug}`}
          style={{
            textDecoration: 'none',
            color: '#1976d2',
            fontWeight: 500
          }}
        >
          {params.value.slug}
        </Link>
      )
    },
    {
      field: 'visitedAt',
      headerName: 'Captured At',
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    }
  ];
  return (
    <Box >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Recent Email Captures
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataTable
          rows={data || []}
          columns={emailsColumns}
          getRowId={(row) => row._id}
        />
      </Box>
    </Box>
  )
}

export default RecentEmail