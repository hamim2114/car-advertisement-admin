import { DeleteOutline } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import React from 'react'
import DataTable from '../../common/DataTable';

const Notifications = () => {
  const columns = [
    { field: 'Title', headerName: 'Title', width: 300 },
    { field: 'Message', headerName: 'Message', width: 450 },
    {
      field: 'options',
      headerName: '',
      width: 100,
      renderCell: (params) => (
        <Stack direction='row' alignItems='center' height='100%'>
          <IconButton>
            <DeleteOutline fontSize='small' />
          </IconButton>
        </Stack>
      ),
    },
  ];
  return (
    <Box maxWidth='xl'>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} justifyContent='space-between'>
        <Box>
          <Typography variant='h5'>Courses</Typography>
          <Typography variant='body2'>Total Courses (10)</Typography>
        </Box>
      </Stack>
      <Box mt={4}>
        <DataTable
          rows={[]}
          columns={columns}
          noRowsLabel='No Notification'
        />
      </Box>
    </Box>
  )
}

export default Notifications