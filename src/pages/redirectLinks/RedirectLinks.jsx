import { Box, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import apiReq from '../../../utils/axiosReq';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import DataTable from '../../common/DataTable';
import CDialog from '../../common/CDialog';
import CButton from '../../common/CButton';
import UpdateLinks from './UpdateLinks';

const RedirectLinks = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLinkData, setEditLinkData] = useState(null);
  const [deleteLinkId, setDeleteLinkId] = useState(null);


  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await apiReq.get('api/links'),
    queryKey: ['links']
  });

  const queryClient = useQueryClient();

  const deleteLinkMutation = useMutation({
    mutationFn: (id) => apiReq.delete(`api/links/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['links']);
    }
  });
  
  const handleEdit = (row) => {
    setEditDialogOpen(true);
    setEditLinkData(row);
  }

  const handleDeleteDialog = (id) => {
    setDeleteDialogOpen(true);
    setDeleteLinkId(id);
  }

  const handleDelete = () => {
    deleteLinkMutation.mutate(deleteLinkId);
    setDeleteDialogOpen(false);
  }


  const columns = [
    {
      field: 'details', headerName: '', width: 100,
      renderCell: (params) => <Link
        style={{ textDecoration: 'none' }}
        to={`${params.row._id}`}>
        details
      </Link>
    },


    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 200,
      renderCell: (params) => (
        <Stack height='100%' justifyContent='center'>
          <Typography> {format(params.row.createdAt, 'dd-MMM-yyyy')}</Typography>
        </Stack>
      ),
    },

    {
      field: 'slug',
      headerName: 'Slug',
      width: 200,
      renderCell: (params) => (
        <Stack justifyContent="center" height='100%'>
          <Typography>{params.row.slug}</Typography>
        </Stack>
      ),
    },
    {
      field: 'destinationUrl',
      headerName: 'Destination URL',
      width: 200,
      renderCell: (params) => (
        <Stack justifyContent="center" height='100%'>
          <a href={params.row.destinationUrl} target='_blank' rel='noreferrer'>{params.row.destinationUrl}</a>
        </Stack>
      ),
    },

    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   width: 200,
    //   renderCell: (params) => (
    //     <Stack height='100%' justifyContent='center'>
    //       <Typography
    //         sx={{
    //           bgcolor: {
    //             pending: 'orange',
    //             upcoming: 'purple',
    //             running: 'steelblue',
    //             completed: 'green',
    //             inactive: 'darkgray'
    //           }[params.row.status],
    //           color: 'white',
    //           width: '120px',
    //           textAlign: 'center',
    //           borderRadius: 1,
    //           fontWeight: 'medium',
    //           px: 1,
    //           py: 0.5,
    //         }}
    //       >
    //         {params.row.status}
    //       </Typography>
    //     </Stack>
    //   ),
    // },

    {
      field: 'options',
      headerName: '',
      width: 100,
      renderCell: (params) => (
        <Stack direction='row' alignItems='center' height='100%'>
          <IconButton onClick={() => handleEdit(params.row)} >
            <EditOutlined fontSize='small' />
          </IconButton>
          <IconButton onClick={() => handleDeleteDialog(params.row._id)} >
            <DeleteOutlined fontSize='small' />
          </IconButton>
        </Stack>
      ),
    },
  ];


  return (
    <Box sx={{
      bgcolor: '#fff',
      p: 3, borderRadius: '16px',
      minHeight: '100vh'
    }} maxWidth='lg'>
      <Typography variant="h5" gutterBottom>
        Redirect Links
      </Typography>

      <Box mt={4}>
        <DataTable
          rows={data?.data || []}
          getRowId={(row) => row._id}
          columns={columns}
          loading={isLoading}
          rowHeight={70}
          noRowsLabel='No lInks Available'
        />
      </Box>

      {/* delete dialog */}
      <CDialog title='Delete Link' open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <Typography>Are you sure you want to delete this link?</Typography>
        <Typography color='error'>This action cannot be undone.</Typography>
        <DialogActions>
          <CButton onClick={() => setDeleteDialogOpen(false)}>Cancel</CButton>
          <CButton variant='contained' loading={deleteLinkMutation.isPending} onClick={handleDelete} color="error">Delete</CButton>
        </DialogActions>
      </CDialog>

      {/* edit dialog */}
      <CDialog closeButton title='Edit Link' open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <UpdateLinks linkData={editLinkData} closeDialog={() => setEditDialogOpen(false)} />
      </CDialog>

    </Box>
  )
}

export default RedirectLinks