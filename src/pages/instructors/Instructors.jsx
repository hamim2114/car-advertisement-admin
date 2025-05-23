import { Add, DeleteOutline, Edit, EditOutlined, MoreVert, Search } from '@mui/icons-material'
import { Avatar, Box, Chip, FormControl, IconButton, InputAdornment, InputLabel, Menu, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import CButton from '../../common/CButton'
import DataTable from '../../common/DataTable';
import { Link } from 'react-router-dom';
import CDialog from '../../common/CDialog';
import AddInstructor from './AddInstructor';
import { axiosReq } from '../../../utils/axiosReq';
import { useQuery } from '@tanstack/react-query';
import EditInstructor from './EditInstructor';


const Instructors = () => {
  const [filter, setFilters] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [instructor, setInstructor] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: instructors, isLoading } = useQuery({
    queryKey: ['instructor', search],
    queryFn: () => axiosReq.get('/instructor/all', { params: { search } })
  })

  const handleDialog = () => setEditDialogOpen(false)

  const handleEdit = (instructor) => {
    setInstructor(instructor);
    setEditDialogOpen(true);
  }


  const columns = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   width: 220,
    //   renderCell: (params) => <Link
    //     style={{ textDecoration: 'none' }}
    //     to={`/instructors/${params.row._id}`}>
    //     {params.row._id}
    //   </Link>
    // },
    {
      field: 'Instructor',
      headerName: 'Instructor',
      width: 300,
      renderCell: (params) => (
        <Stack direction='row' gap={1} alignItems="center" height='100%'>
          <Avatar src={params.row.img} />
          <Box>
            <Link to={`${params.row._id}`}>
              <Typography sx={{ fontWeight: 600 }}>{params.row.username}</Typography>
            </Link>
            <Typography>{params.row.email}</Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'Phone',
      headerName: 'Phone',
      width: 200,
      renderCell: (params) => params.row.phone,
    },
    {
      field: 'ActiveCourse',
      headerName: 'Active Course',
      width: 200,
      renderCell: (params) => {
        const activeCourses = params.row.courses.filter(course => course.status === 'active');
        return activeCourses.length

      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Chip label={params.row.isVerified ? 'Verified' : 'Unverified'} color={params.row.isVerified ? 'success' : 'warning'} />
      ),
    },
    {
      field: 'options',
      headerName: '',
      width: 100,
      renderCell: (params) => (
        <Stack direction='row' alignItems='center' height='100%'>
          <IconButton onClick={() => handleEdit(params.row)} >
            <EditOutlined fontSize='small' />
          </IconButton>
        </Stack>
      ),
    },
  ];


  return (
    <Box maxWidth='xl'>
      <Box>
        <Typography variant='h5'>Instructors</Typography>
        <Typography variant='body2'>Total Instructors (10)</Typography>
      </Box>

      {/* add instructor  */}
      <CDialog open={addDialogOpen} title='Add Instructor' onClose={() => setAddDialogOpen(false)}>
        <AddInstructor onClose={() => setAddDialogOpen(false)} />
      </CDialog>

      {/* edit instructor */}
      <CDialog open={editDialogOpen} title='Edit Instructor' onClose={handleDialog}>
        <EditInstructor data={instructor} onClose={handleDialog} />
      </CDialog>

      <Stack direction='row' mt={2} gap={2} justifyContent='space-between'>
        <Box sx={{ width: 200 }}>
          <TextField
            fullWidth
            size="small"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <CButton onClick={() => setAddDialogOpen(true)} contained startIcon={<Add />} >Add a Instructor</CButton>
      </Stack>

      <Box mt={4}>
        <DataTable
          rows={instructors?.data || []}
          columns={columns}
          rowHeight={70}
          loading={isLoading}
          getRowId={(row) => row._id}
          noRowsLabel='No Instructor Available'
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>

    </Box>
  )
}

export default Instructors