/* eslint-disable react/prop-types */
import { Avatar, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CButton from '../../../common/CButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../../../utils/axiosReq';
import useAuth from '../../../hook/useAuth';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { deleteImage } from '../../../../utils/upload';
import { InfoOutlined } from '@mui/icons-material';


const UpdateCourse = ({ course, onClose }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseStatus, setCourseStatus] = useState('');
  const [contentStatus, setContentStatus] = useState('');
  const { token } = useAuth()

  const queryClient = useQueryClient();

  const updateCourseMutation = useMutation({
    mutationFn: (input) => axiosReq.put(`/course/update/${course._id}`, input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['course']);
      onClose();
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const { data: contentData } = useQuery({
    queryKey: ['content', course._id],
    queryFn: async () => {
      const response = await axiosReq.get(`/course/content/${course._id}`, { headers: { Authorization: token } });
      return response.data;
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: (input) => axiosReq.put(`/course/update/content/${course._id}`, input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['content', course._id]);
      onClose()
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const publicId = course?.cover?.split('/').pop().split('.')[0];

  const deleteMutation = useMutation({
    mutationFn: () => axiosReq.delete(`/course/delete/${course._id}`, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['course']);
      setDeleteDialogOpen(false);
      onClose();
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const handleDeleteCourse = () => {
    deleteMutation.mutate();
    deleteImage(publicId)
    onClose();
  }

  const handleSaveCourseInfo = async () => {
    updateCourseMutation.mutate({ status: courseStatus });
  }

  const handleSaveContentInfo = async () => {
    updateContentMutation.mutate({ status: contentStatus });
  }

  useEffect(() => {
    setCourseStatus(course?.status ?? '')
    setContentStatus(contentData?.status ?? '')
  }, [course, contentData]);



  return (
    <Stack gap={2}>

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between' alignItems='center'>

        <Box display="flex" alignItems="center">
          <Avatar src={course?.cover || '/no-image.png'} sx={{ borderRadius: '4px', mr: 1 }} />
          <Box>
            <Link to={`/admin/course/${course?._id}`} style={{ textDecoration: 'none' }}>
              <Typography>{course?.title}</Typography>
            </Link>
            <Typography variant='body2' color='text.secondary'>{course?.category?.name}</Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Avatar src={course?.instructor?.img ?? ''} sx={{ borderRadius: '4px', mr: 1 }} />
          <Box>
            <Link to={`/instructor/${course?.instructor?._id}`} style={{ textDecoration: 'none' }}>
              <Typography>@{course?.instructor?.username}</Typography>
            </Link>
            <Typography variant='body2' color='text.secondary'>{course?.instructor?.email}</Typography>
          </Box>
        </Box>
      </Stack>

      <FormControl size='small' fullWidth>
        <label>Course Status</label>
        <Select
          value={courseStatus || ''}
          onChange={e => setCourseStatus(e.target.value)}
        >
          <MenuItem disabled value='pending'>Pending</MenuItem>
          <MenuItem value='upcoming'>Upcoming</MenuItem>
          <MenuItem value='running'>Running</MenuItem>
          <MenuItem value='completed'>Completed</MenuItem>
          <MenuItem value='inactive'>Inactive</MenuItem>
        </Select>
      </FormControl>

      <CButton loading={updateCourseMutation.isPending} onClick={handleSaveCourseInfo} contained>Update Course</CButton>

      {!contentData && <Typography variant='body2' sx={{ alignSelf: 'start', display: 'flex', alignItems: 'center', gap: 1 }} color='primary'> <InfoOutlined /> No content found for this course</Typography>}
      <FormControl sx={{ opacity: !contentData ? 0.5 : 1 }} size='small' fullWidth>
        <label>Content Status</label>
        <Select
          disabled={!contentData || course?.status === 'pending'}
          value={contentStatus || ''}
          onChange={e => setContentStatus(e.target.value)}
        >
          <MenuItem disabled value='pending'>Pending</MenuItem>
          <MenuItem value='published'>Published</MenuItem>
          <MenuItem value='archived'>Archived</MenuItem>
        </Select>
      </FormControl>

      <CButton disabled={!contentData || course?.status === 'pending'} loading={updateContentMutation.isPending} onClick={handleSaveContentInfo} contained>Update Content</CButton>


      <CButton onClick={() => setDeleteDialogOpen(true)} sx={{ alignSelf: 'flex-start' }} color='error' >Delete this Course</CButton>
      {/* delete dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Course <span style={{ fontWeight: 'bold', color: 'red' }}> & Content</span></DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this course and its content?</DialogContentText>
          <DialogContentText color='error'>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <CButton onClick={() => setDeleteDialogOpen(false)}>Cancel</CButton>
          <CButton loading={deleteMutation.isPending} onClick={handleDeleteCourse} color="error">Delete</CButton>
        </DialogActions>
      </Dialog>
    </Stack >
  );
};

export default UpdateCourse;