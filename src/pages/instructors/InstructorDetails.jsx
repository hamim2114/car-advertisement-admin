import { Box, Grid, Avatar, Typography, Card, CardContent, Divider, Chip, IconButton } from '@mui/material'
import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { axiosReq } from '../../../utils/axiosReq';
import Loader from '../../common/Loader';
import { format } from 'date-fns';
import { ArrowBack } from '@mui/icons-material';

const InstructorDetails = () => {
  const { id } = useParams()

  const { data: instructor, isLoading } = useQuery({
    queryKey: ['instructor', id],
    queryFn: async () => {
      const res = await axiosReq.get(`/instructor/details/${id}`)
      return res.data
    }
  })
  const navigate = useNavigate()
  if (isLoading) {
    return <Loader />
  }

  return (
    <Box sx={{
      bgcolor: '#fff',
      borderRadius: '8px',
      p: 3,
      minHeight: '100vh'
    }} maxWidth='xl'>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBack />
      </IconButton>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={instructor.img || '/default-avatar.png'}
              alt={instructor.name}
              sx={{ width: 200, height: 200, mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>{instructor.name}</Typography>
            <Typography variant="body1" color="textSecondary">@{instructor.username}</Typography>
            <Chip sx={{ mt: 2 }} label={instructor.role} color="primary" />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>Personal Information</Typography>
          <Typography><strong>Email:</strong> {instructor.email}</Typography>
          <Typography><strong>Phone:</strong> {instructor.phone}</Typography>
          <Typography><strong>Address:</strong> {instructor.address || 'Not provided'}</Typography>
          <Typography><strong>About:</strong> {instructor.about || 'No information provided'}</Typography>
          <Typography><strong>Joined:</strong> {format(new Date(instructor.createdAt), 'dd MMM yyyy')}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Courses</Typography>
        <Grid container spacing={2}>
          {instructor.courses.length === 0 ? (
            <Typography sx={{ textAlign: 'center', width: '100%', p: 5 }}>No courses available</Typography>
          ) : (
            instructor.courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card>
                  <CardContent>
                    <Link to={`/dashboard/course/${course._id}`}>
                      <Typography variant="h6">{course.title}</Typography>
                    </Link>
                    <Typography color="textSecondary">Category: {course.category.name}</Typography>
                    <Typography>Price: ${course.price}</Typography>
                    <Typography>Start Date: {format(new Date(course.startDate), 'dd MMM yyyy')}</Typography>
                    <Typography>End Date: {format(new Date(course.endDate), 'dd MMM yyyy')}</Typography>
                    <Chip
                      sx={{ mt: 1 }}
                      label={course.status}
                      color={course.status === 'active' ? 'success' : 'default'}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  )
}

export default InstructorDetails