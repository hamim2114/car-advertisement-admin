import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, Typography, MenuItem, Stack, IconButton, Avatar, Autocomplete, FormControl, InputLabel, Select } from '@mui/material';
import { Close } from '@mui/icons-material';
import CTextField from '../../common/CTextField';
import CButton from '../../common/CButton';
import { axiosReq } from '../../../utils/axiosReq';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAuth from '../../hook/useAuth';
import toast from 'react-hot-toast';

const EnrollStudent = ({ onClose, course }) => {
  const [paymentStatus, setPaymentStatus] = useState('')
  const [enrollmentStatus, setEnrollmentStatus] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [errors, setErrors] = useState({
    student: '',
    course: '',
    paymentStatus: '',
    enrollmentStatus: ''
  })

  const { data: students, isLoading } = useQuery({
    queryKey: ['student'],
    queryFn: () => axiosReq.get('/student/all'),
  })

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => axiosReq.get('/course/all'),
  })

  const { token } = useAuth()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.post('course/admin/enroll', input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['enrollment']);
      onClose()
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const handleSave = () => {
    const newErrors = {
      student: !selectedStudent ? 'Please select a student' : '',
      course: !selectedCourse ? 'Please select a course' : '',
      paymentStatus: !paymentStatus ? 'Please select a payment status' : '',
      enrollmentStatus: !enrollmentStatus ? 'Please select an enrollment status' : ''
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }
    mutation.mutate({
      studentId: selectedStudent._id,
      courseId: selectedCourse._id,
      paymentStatus,
      enrollmentStatus
    });
  };

  useEffect(() => {
    setSelectedCourse(course ?? null)
  }, [course])

  return (
    <Box>
      <Stack gap={2}>
        {/* select student */}
        <Autocomplete
          size='small'
          options={students?.data ?? []}
          onChange={(_, value) => {
            setSelectedStudent(value)
            setErrors(prev => ({ ...prev, student: '' }))
          }}
          loading={isLoading}
          getOptionLabel={(option) => option.username}
          renderOption={(props, option) => (
            <li {...props} key={option._id} >
              <Stack direction='row' alignItems='center' gap={1}>
                <Avatar src={option.img ?? ''} sx={{ width: 30, height: 30 }} />
                <Box>
                  <Link to={`/dashboard/student/${option._id}`}>
                    <Typography>@{option.username}</Typography>
                  </Link>
                  <Typography sx={{ fontSize: '12px' }}>{option.email}</Typography>
                </Box>
              </Stack>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select a Student"
              error={!!errors.student}
              helperText={errors.student}
            />
          )}
        />
        {/* course to enroll */}
        <Autocomplete
          size='small'
          disabled={course}
          options={courses?.data ?? []}
          value={selectedCourse}
          onChange={(_, value) => {
            setSelectedCourse(value)
            setErrors(prev => ({ ...prev, course: '' }))
          }}
          loading={isLoadingCourses}
          getOptionLabel={(option) => option.title}
          renderOption={(props, option) => (
            <li {...props} key={option._id}>
              <Stack direction='row' alignItems='center'>
                <Avatar src={option.cover ?? '/no-image.png'} sx={{ borderRadius: '4px', mr: 1 }} />
                <Box>
                  <Typography>{option.title}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>{option.category.name}</Typography>
                </Box>
              </Stack>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Course to Enroll"
              error={!!errors.course}
              helperText={errors.course}
            />
          )}
        />
        {/* select payment */}
        <Box sx={{ minWidth: 220 }} >
          <FormControl fullWidth size='small' error={!!errors.paymentStatus}>
            <InputLabel>Payment Status</InputLabel>
            <Select
              value={paymentStatus}
              label="Payment Status"
              onChange={(e) => {
                setPaymentStatus(e.target.value)
                setErrors(prev => ({ ...prev, paymentStatus: '' }))
              }}
            >
              <MenuItem value={'unpaid'}>Unpaid</MenuItem>
              <MenuItem value={'paid'}>Paid</MenuItem>
            </Select>
            {errors.paymentStatus && <Typography color="error" variant="caption">{errors.paymentStatus}</Typography>}
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 220 }} >
          <FormControl fullWidth size='small' error={!!errors.enrollmentStatus}>
            <InputLabel>Enrollment Status</InputLabel>
            <Select
              value={enrollmentStatus}
              label="Enrollment Status"
              onChange={(e) => {
                setEnrollmentStatus(e.target.value)
                setErrors(prev => ({ ...prev, enrollmentStatus: '' }))
              }}
            >
              <MenuItem value={'pending'}>Pending</MenuItem>
              <MenuItem value={'approved'}>Approved</MenuItem>
            </Select>
            {errors.enrollmentStatus && <Typography color="error" variant="caption">{errors.enrollmentStatus}</Typography>}
          </FormControl>
        </Box>

        <CButton loading={mutation.isPending} contained onClick={handleSave}>
          Enroll Student
        </CButton>
      </Stack>
    </Box >
  );
};

export default EnrollStudent;
