/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Box, Stack, Avatar, Button, Typography, ListItem, Autocomplete, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import CTextField from '../../common/CTextField';
import CButton from '../../common/CButton';
import toast from 'react-hot-toast';
import { deleteImage, uploadImage } from '../../../utils/upload';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../../utils/axiosReq';
import useAuth from '../../hook/useAuth';
import { Info } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const EditStudent = ({ data, onClose }) => {
  const [file, setFile] = useState(null);
  const [imgUploading, setImgUploading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [payload, setPayload] = useState({
    name: '',
    username: '',
    phone: '',
    address: '',
    about: '',
    img: ''
  });
  const [errors, setErrors] = useState({});

  const { token } = useAuth()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.put(`/auth/user/edit/${data._id}`, input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['student'])
      setDeleteDialogOpen(false)
      onClose()
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => axiosReq.delete(`/auth/user/delete/${data._id}`, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['student']);
      onClose();
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const publicId = data?.img?.split('/').pop().split('.')[0];

  const handleSave = async () => {
    let newErrors = {};
    if (!payload.phone) {
      newErrors.phone = 'Phone number required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const studentData = {
      ...payload,
      img: data?.img
    };
    if (file) {
      setImgUploading(true);
      if (data?.img) {
        await deleteImage(publicId);
      }
      const { secure_url } = await uploadImage(file);
      studentData.img = secure_url;
      mutation.mutate(studentData);
      setImgUploading(false);
    } else {
      mutation.mutate(studentData);
    }
  };

  const handleDeleteStudent = () => {
    deleteMutation.mutate();
    setDeleteDialogOpen(false)
    if (publicId) {
      deleteImage(publicId)
    }
  };

  useEffect(() => {
    setPayload({
      name: data?.name || '',
      phone: data?.phone || '',
      address: data?.address || '',
      about: data?.about || '',
    })
  }, [data])

  return (
    <Box>
      <Stack gap={2}>
        <Stack direction="row" gap={2} alignItems="center">
          <Avatar src={file ? URL.createObjectURL(file) : data?.img} />
          <input accept="image/*" hidden id="file" type="file" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="file">
            <Button size='small' variant="outlined" component="span">
              Upload
            </Button>
          </label>
        </Stack>
        <Box>
          <Typography> <b>UserName:</b> <Link to={`${data._id}`}> @{data.username}</Link></Typography>
          <Typography> <b>Email:</b> {data.email}</Typography>
        </Box>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          <CTextField
            topLabel="Full Name"
            size='small'
            name="name"
            value={payload.name}
            onChange={handleChange}
            required
          />
          <CTextField
            topLabel="User Name"
            size='small'
            name="username"
            value={payload.username}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.username}
            helperText={errors.username}
          />

        </Stack>

        <CTextField
          topLabel="Phone Number"
          size='small'
          name="phone"
          variant="outlined"
          value={payload.phone}
          onChange={handleChange}
          required
          error={!!errors.phone}
          helperText={errors.phone}
        />

        <CTextField
          topLabel="Address"
          size='small'
          name="address"
          value={payload.address}
          onChange={handleChange}
          required
        />

        <CTextField
          topLabel="About Student"
          size='small'
          name="about"
          value={payload.about}
          onChange={handleChange}
          multiline
          rows={3}
        />

        <CButton loading={mutation.isPending || imgUploading} contained onClick={handleSave}>
          Save
        </CButton>


      </Stack>
      <CButton onClick={() => setDeleteDialogOpen(true)} color='error' >Delete</CButton>
      {/* delete dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Student</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this student?</DialogContentText>
          <DialogContentText color='error'>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <CButton onClick={() => setDeleteDialogOpen(false)}>Cancel</CButton>
          <CButton loading={deleteMutation.isPending} onClick={handleDeleteStudent} color="error">Delete</CButton>
        </DialogActions>
      </Dialog>
    </Box >
  );
};

export default EditStudent;
