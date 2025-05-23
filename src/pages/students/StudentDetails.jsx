import { Box, Typography, Avatar, Grid, Card, CardContent, Divider, IconButton } from '@mui/material'
import React from 'react'
import { axiosReq } from '../../../utils/axiosReq'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'

const StudentDetails = () => {
  const { id } = useParams()

  const { data: student, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      const res = await axiosReq.get(`/student/details/${id}`)
      return res.data
    }
  })
  const navigate = useNavigate()
  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Box maxWidth='lg' sx={{
      bgcolor: '#fff',
      p: 4,
      minHeight: '100vh'
    }}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBack />
      </IconButton>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={student.img || '/default-avatar.png'}
              alt={student.name}
              sx={{ width: 200, height: 200, mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>{student.name}</Typography>
            <Typography variant="body1" color="textSecondary">@{student.username}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>Personal Information</Typography>
          <Typography><strong>Email:</strong> {student.email}</Typography>
          <Typography><strong>Phone:</strong> {student.phone}</Typography>
          <Typography><strong>Address:</strong> {student.address || 'Not provided'}</Typography>
          <Typography><strong>About:</strong> {student.about || 'No information provided'}</Typography>
          <Typography><strong>Role:</strong> {student.role}</Typography>
          <Typography><strong>Joined:</strong> {new Date(student.createdAt).toLocaleDateString()}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Enrolled Courses</Typography>
        <Grid container spacing={2}>
          {
            student?.enrolledCourses.length === 0 ? (
              <Typography sx={{ textAlign: 'center', width: '100%', p: 5 }}>No courses enrolled</Typography>
            ) : (
              student?.enrolledCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card>
                    <CardContent>
                      <Link to={`/dashboard/course/${course._id}`}>
                        <Typography variant="h6">{course.title}</Typography>
                      </Link>
                      <Typography color="textSecondary">Instructor:
                        <Link to={`/dashboard/instructor/${course.instructor._id}`}>
                          @{course.instructor.username}
                        </Link>
                      </Typography>
                      <Typography>Price: ${course.price}</Typography>
                      <Typography>Start Date: {new Date(course.startDate).toLocaleDateString()}</Typography>
                      <Typography>End Date: {new Date(course.endDate).toLocaleDateString()}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )
          }
        </Grid>
      </Box>
    </Box>
  )
}

export default StudentDetails
