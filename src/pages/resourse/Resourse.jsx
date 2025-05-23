import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Add, ContentCopyOutlined, DeleteOutline, DownloadOutlined, EditOutlined, GetAppOutlined, InsertDriveFileOutlined, Person2Outlined, Search } from '@mui/icons-material'
import useIsMobile from '../../hook/useIsMobile'
import DataTable from '../../common/DataTable'
import CButton from '../../common/CButton'
import CDialog from '../../common/CDialog'
import AddResourse from './AddResourse'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosReq } from '../../../utils/axiosReq'
import EditResourse from './EditResourse'
import useAuth from '../../hook/useAuth'
import toast from 'react-hot-toast'

const resourses = [
  {
    id: 1,
    title: '907 – Responsive Multi-Purpose WordPress Theme',
    category: 'Theme',
    updateOn: 'January 20, 2022',
    version: '5.1.5',
    files: 2,
  },
  {
    id: 2,
    title: 'Add To Cart Redirect for WooCommerce',
    category: 'Plugins',
    updateOn: 'January 20, 2022',
    version: '3.4.0',
    files: 1,
  },
  {
    id: 3,
    title: 'AdForest – Classified Ads WordPress Theme',
    category: 'Themes',
    updateOn: 'January 20, 2022',
    version: '2.0.2',
    files: 1,
  },
  {
    id: 4,
    title: 'Avada | Website Builder For WordPress & WooCommerce',
    category: 'Themes',
    updateOn: 'January 20, 2022',
    version: '2.0.2'
  },
  {
    id: 5,
    title: 'Avada | Website Builder For WordPress & WooCommerce',
    category: 'Themes',
    updateOn: 'January 20, 2022',
    version: '2.0.2'
  },
  {
    id: 6,
    title: 'Avada | Website Builder For WordPress & WooCommerce',
    category: 'Themes',
    updateOn: 'January 20, 2022',
    version: '2.0.2'
  },
]

const Resourse = () => {
  const [search, setSearch] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editResourse, setEditResourse] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteResourseId, setDeleteResourseId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { token } = useAuth()

  const queryClient = useQueryClient()

  const { data: resourses, isLoading } = useQuery({
    queryKey: ['resourse', search, selectedCategory],
    queryFn: async () => {
      const res = await axiosReq.get('/resourse/all', {
        params: {
          search: search,
          category: selectedCategory === 'All' ? '' : selectedCategory
        }
      })
      return res.data
    }
  })

  const { data: category, } = useQuery({
    queryKey: ['resourse/category'],
    queryFn: async () => {
      const res = await axiosReq.get('/resourse/all')
      return res.data.map(item => item.category)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: () => axiosReq.delete(`/resourse/delete/${deleteResourseId}`, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['resourse']);
      setDeleteDialogOpen(false)
      setDeleteResourseId(null)
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });



  const handleEdit = (resourse) => {
    setEditDialogOpen(true)
    setEditResourse(resourse)
  }

  const handleDeleteDialog = (id) => {
    setDeleteDialogOpen(true)
    setDeleteResourseId(id)
  }

  const handleDelete = () => {
    deleteMutation.mutate()
  }


  const columns = [
    {
      field: 'Files', headerName: 'Files', width: 500,
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' gap={1.5} alignItems='center'>
          <img style={{ width: '30px' }} src="/file2.svg" alt="" />
          <Stack >
            <Typography >{params.row.name}</Typography>
            {params.row.files && (
              <Typography sx={{ fontSize: '12px', display: 'inline-flex', gap: .5, alignItems: 'center' }}>
                <ContentCopyOutlined sx={{ fontSize: '12px' }} /> {params.row.files} files(s)
              </Typography>
            )}
          </Stack>
        </Stack>
      )
    },
    {
      field: 'Categories', headerName: 'Categories', width: 250,
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
          <Typography>{params.row.category}</Typography>
        </Stack>
      )
    },
    // {
    //   field: 'updateOn', headerName: 'Update On', width: 200,
    //   renderCell: (params) => (
    //     <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
    //       <Typography>{params.row.updateOn}</Typography>
    //     </Stack>
    //   )
    // },
    {
      field: 'version', headerName: 'Version', width: 200,
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} justifyContent='center'>
          <Typography>{params.row.version}</Typography>
        </Stack>
      )
    },
    {
      field: 'options',
      headerName: '',
      width: 100,
      renderCell: (params) => (
        <Stack direction='row' alignItems='center' height='100%'>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditOutlined fontSize='small' />
          </IconButton>
          <IconButton onClick={() => handleDeleteDialog(params.row._id)}>
            <DeleteOutline fontSize='small' />
          </IconButton>
        </Stack>
      ),
    },
    {
      field: 'Download', headerName: '', width: 150,
      renderCell: (params) => <IconButton onClick={() => window.open(params.row.url, '_blank')} ><DownloadOutlined /></IconButton>
    },
  ];
  return (
    <Box>
      <Box>
        <Typography variant='h5'>Resourses</Typography>
        <Typography variant='body2'>Total Resourses (10)</Typography>
      </Box>

      <Stack direction='row' mt={2} justifyContent='space-between'>
        <Box />
        <CButton style={{ width: '100px' }} onClick={() => setAddDialogOpen(true)} contained startIcon={<Add />} >Add</CButton>
      </Stack>

      <Box display='flex' alignItems='center' gap={2} my={2}>
        <TextField
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ width: 150 }} size='small' >
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value='All' onClick={() => setSelectedCategory('All')}>All</MenuItem>
            {category?.map((item, index) => (
              <MenuItem key={index} value={item}>{item}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <CDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} title='Add Resourse'>
        <AddResourse onClose={() => setAddDialogOpen(false)} />
      </CDialog>

      <CDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} title='Edit Resourse'>
        <EditResourse onClose={() => setEditDialogOpen(false)} resourse={editResourse} />
      </CDialog>

      {/* delete dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete resourse</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this resourse?</DialogContentText>
          <DialogContentText color='error'>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <CButton onClick={() => setDeleteDialogOpen(false)}>Cancel</CButton>
          <CButton loading={deleteMutation.isPending} onClick={handleDelete} color="error">Delete</CButton>
        </DialogActions>
      </Dialog>

      <Box mt={4}>
        <DataTable
          columns={columns}
          rows={resourses}
          getRowId={(row) => row._id}
          loading={isLoading}
        />
      </Box>
    </Box>
  )
}

export default Resourse