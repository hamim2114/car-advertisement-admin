import { Add, DeleteOutline, EditOutlined, Search } from '@mui/icons-material'
import { Avatar, Box, Chip, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import CButton from '../../common/CButton'
import DataTable from '../../common/DataTable';
import { Link } from 'react-router-dom';
import CDialog from '../../common/CDialog';
import EnrollStudent from './EnrollStudent';
import { useQuery } from '@tanstack/react-query';
import { axiosReq } from '../../../utils/axiosReq';
import useAuth from '../../hook/useAuth';

const rows = [
  {
    id: 1,
    name: 'Frensis Burner',
    username: 'frensis3232',
    email: 'dem01234@gmail.com',
    phone: '4234624233',
    enrolledCourse: 'UI/UX Design with Adobe XD',
    enrollmentDate: '12/02/2024',
    status: 'Pending',
  },
];


const Enrolment = () => {
  const [status, setStatus] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const handleDialog = () => setAddDialogOpen(p => !p)

  const { token } = useAuth()

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['enrollment'],
    queryFn: () => axiosReq.get('course/enrolled/all', { headers: { Authorization: token } })
  })

  const columns = [
    {
      field: 'Students',
      headerName: 'Students',
      width: 250,
      renderCell: (params) => {
        const student = params.row.student
        return (
          <Stack direction='row' alignItems='center' height='100%'>
            <Avatar src={student.img ?? ''} sx={{ mr: 1 }} />
            <Box>
              <Link to={`/dashboard/student/${student._id}`} style={{ textDecoration: 'none' }}>
                <Typography>@{student.username}</Typography>
              </Link>
              <Typography variant='body2' color='text.secondary'>{params.row.student.email}</Typography>
            </Box>
          </Stack>
        )
      },
    },
    {
      field: 'Info',
      headerName: 'Info',
      width: 200,
      renderCell: (params) => {
        const student = params.row.student
        return (
          <Stack height='100%' justifyContent='center'>
            <Typography>{student?.name}</Typography>
            <Typography variant='body2' color='text.secondary'>{student?.phone}</Typography>
          </Stack>
        )
      },
    },
    {
      field: 'EnrolledCourse',
      headerName: 'Enrolled Course',
      width: 500,
      renderCell: (params) => {
        const enrolledCourses = params.row.enrolledCourses
        return (
          <Stack justifyContent='center' height='100%'>
            {enrolledCourses?.length > 2 ? (
              <>
                <Link to={`/dashboard/course/${enrolledCourses[0].course._id}`} style={{ textDecoration: 'none' }}>
                  <Typography>{enrolledCourses[0].course.title}</Typography>
                </Link>
                <Link to={`/dashboard/course/${enrolledCourses[1].course._id}`} style={{ textDecoration: 'none' }}>
                  <Typography>{enrolledCourses[1].course.title}</Typography>
                </Link>
                <Typography>+{enrolledCourses.length - 2} more</Typography>
              </>
            ) : (
              enrolledCourses?.map((data) => (
                <Link key={data.course._id} to={`/dashboard/course/${data.course._id}`} style={{ textDecoration: 'none' }}>
                  <Typography>{data.course.title}</Typography>
                </Link>
              ))
            )}
          </Stack>
        )
      },
    },
  ];


  return (
    <Box maxWidth='xl'>
      <Box>
        <Typography variant='h5'>Enrollment List</Typography>
        <Typography variant='body2'>Total Enrollments (10)</Typography>
      </Box>
      <Stack direction='row' mt={2} justifyContent='space-between'>
        <Box />
        <CButton onClick={handleDialog} contained startIcon={<Add />} >Enroll a Student</CButton>
      </Stack>

      {/* add student  */}
      <CDialog open={addDialogOpen} title='Enroll a Student' onClose={handleDialog}>
        <EnrollStudent onClose={handleDialog} />
      </CDialog>

      <Box mt={4}>
        <DataTable
          rows={enrollments?.data || []}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.student._id}
          rowHeight={70}
          noRowsLabel='No Enrollment Found'
        />
      </Box>

    </Box>
  )
}

export default Enrolment