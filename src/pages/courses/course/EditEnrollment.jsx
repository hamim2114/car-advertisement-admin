/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Box, Typography, MenuItem, Stack, FormControl, InputLabel, Select, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog, Avatar } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAuth from '../../../hook/useAuth';
import { axiosReq } from '../../../../utils/axiosReq';
import CButton from '../../../common/CButton';
import { Link } from 'react-router-dom';

const EditEnrollment = ({ course, data, onClose }) => {
  const [paymentStatus, setPaymentStatus] = useState('')
  const [enrollmentStatus, setEnrollmentStatus] = useState('')
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [errors, setErrors] = useState({
    paymentStatus: '',
    enrollmentStatus: ''
  })
  const { token } = useAuth()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.put('course/enrolled/edit', input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['course', course._id]);
      onClose()
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (input) => axiosReq.post('/course/enrolled/cancel', input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['course']);
      setCancelDialogOpen(false);
      onClose();
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const handleSave = () => {
    const newErrors = {
      paymentStatus: !paymentStatus ? 'Please select a payment status' : '',
      enrollmentStatus: !enrollmentStatus ? 'Please select an enrollment status' : ''
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }
    mutation.mutate({
      studentId: data.student._id,
      courseId: course._id,
      paymentStatus,
      enrollmentStatus
    });
  };

  const handleCancelEnrollment = () => {
    deleteMutation.mutate({ studentId: data.student._id, courseId: course._id })
  }

  useEffect(() => {
    setPaymentStatus(data.paymentStatus)
    setEnrollmentStatus(data.enrollmentStatus)
  }, [data])

  return (
    <Box>
      <Stack gap={2}>

        <Stack mb={3} direction='row' alignItems='center' gap={1}>
          <Avatar src={data.student.img ?? ''} sx={{ width: 30, height: 30 }} />
          <Box>
            <Link to={`/dashboard/student/${data.student._id}`}>
              <Typography>@{data.student.username}</Typography>
            </Link>
            <Typography sx={{ fontSize: '12px' }}>{data.student.email}</Typography>
          </Box>
        </Stack>

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

        <CButton loading={mutation.isPending} contained onClick={handleSave}>
          Update
        </CButton>

        {/* Cancell enrollment dialog */}
        <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
          <DialogTitle>Cancel Enrollment</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to cancel this enrollment?</DialogContentText>
            <DialogContentText color='error'>This action cannot be undone.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <CButton onClick={() => setCancelDialogOpen(false)}>Cancel</CButton>
            <CButton loading={deleteMutation.isPending} onClick={handleCancelEnrollment} color="error">Delete</CButton>
          </DialogActions>
        </Dialog>

      </Stack>
      <CButton sx={{ mt: 2 }} color='error' onClick={() => setCancelDialogOpen(true)}>Cancel Enrollment</CButton>
    </Box >
  );
};

export default EditEnrollment;
