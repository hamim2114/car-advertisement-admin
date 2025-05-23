import { DeleteOutline, EditOutlined } from '@mui/icons-material'
import { Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import EditFaq from './EditFaq'
import CDialog from '../../common/CDialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosReq } from '../../../utils/axiosReq'
import useAuth from '../../hook/useAuth'
import toast from 'react-hot-toast'
import CButton from '../../common/CButton'

const FAQCard = ({ item }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { token } = useAuth()

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => axiosReq.delete(`/faq/delete/${item._id}`, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['faq']);
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const handleDelete = () => {
    deleteMutation.mutate()
    setDeleteDialogOpen(false)
  }


  return (
    <Stack sx={{
      maxWidth: '600px',
      width: '100%',
      borderRadius: '8px',
      border: '1px solid lightgray',
      bgcolor: '#fff'
    }}>
      <Stack p={1.5} direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant='h6'>{item?.question}</Typography>
        <Stack direction='row'>
          <IconButton onClick={() => setEditDialogOpen(true)}><EditOutlined fontSize='small' /></IconButton>
          <IconButton onClick={() => setDeleteDialogOpen(true)}><DeleteOutline fontSize='small' /></IconButton>
        </Stack>
      </Stack>
      <Divider />
      <Typography p={1.5} variant='body2'>{item?.answer}</Typography>

      <CDialog disableOutsideClick={true} title='Edit FAQ' open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <EditFaq data={item} onClose={() => setEditDialogOpen(false)} />
      </CDialog>

      {/* delete dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete FAQ</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this FAQ?</DialogContentText>
          <DialogContentText color='error'>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <CButton onClick={() => setDeleteDialogOpen(false)}>Cancel</CButton>
          <CButton loading={deleteMutation.isPending} onClick={handleDelete} color="error">Delete</CButton>
        </DialogActions>
      </Dialog>

    </Stack>
  )
}

export default FAQCard