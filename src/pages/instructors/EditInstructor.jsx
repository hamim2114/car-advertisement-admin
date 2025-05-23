/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, Typography, MenuItem, Stack, IconButton, Avatar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Switch, FormControlLabel, FormGroup } from '@mui/material';
import { Close } from '@mui/icons-material';
import CTextField from '../../common/CTextField';
import CButton from '../../common/CButton';
import toast from 'react-hot-toast';
import { deleteImage, uploadImage } from '../../../utils/upload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../../utils/axiosReq';
import useAuth from '../../hook/useAuth';
import { Link } from 'react-router-dom';

const EditInstructor = ({ data, onClose }) => {
  const [file, setFile] = useState(null);
  const [imgUploading, setImgUploading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isVerified, setIsVerified] = useState(false);

  const [instructor, setInstructor] = useState({
    name: '',
    username: '',
    phone: '',
    address: '',
    about: '',
  });

  const { token } = useAuth()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.put(`/auth/user/edit/${data._id}`, input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['instructor'])
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
      queryClient.invalidateQueries(['instructor']);
      onClose();
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstructor((prev) => ({ ...prev, [name]: value }));
  };

  const publicId = data?.img?.split('/').pop().split('.')[0];

  const handleUpdate = async () => {
    if (!instructor.phone) {
      toast.error('Phone number required');
      return;
    }
    let imgUrl = data.img
    if (file) {
      setImgUploading(true)
      await deleteImage(publicId)
      const { secure_url } = await uploadImage(file);
      imgUrl = secure_url;
      setImgUploading(false)
    }
    mutation.mutate({
      ...instructor,
      // isVerified,
      img: imgUrl
    })
  };

  const handleDeleteInstructor = () => {
    deleteMutation.mutate();
    setDeleteDialogOpen(false)
    if (publicId) {
      deleteImage(publicId)
    }
  };

  useEffect(() => {
    setInstructor({
      name: data.name,
      phone: data.phone,
      address: data.address,
      about: data.about,
    });
    setIsVerified(data.isVerified)
  }, [data]);

  return (
    <Box>
      <Stack gap={2}>
        <Stack direction="row" gap={2} alignItems="center">
          <Avatar src={file ? URL.createObjectURL(file) : data.img} />
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
            value={instructor.name}
            onChange={handleChange}
            required
          />
          <CTextField
            topLabel="User Name"
            size='small'
            name="username"
            value={instructor.username}
            onChange={handleChange}
            fullWidth
            required
          />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>

          <CTextField
            topLabel="Phone Number"
            size='small'
            name="phone"
            variant="outlined"
            value={instructor.phone}
            onChange={handleChange}
            required
          />
        </Stack>

        <CTextField
          topLabel="Address"
          size='small'
          name="address"
          value={instructor.address}
          onChange={handleChange}
          required
        />

        <CTextField
          topLabel="About Instructor"
          size='small'
          name="about"
          value={instructor.about}
          onChange={handleChange}
          multiline
          rows={3}
        />

        {/* <FormGroup sx={{ width: 'fit-content' }}>
          <FormControlLabel control={<Switch
            disabled={data.isVerified}
            checked={isVerified}
            onChange={(e) => setIsVerified(e.target.checked)}
          />} label={isVerified ? 'Verified' : 'Unverified'} />
        </FormGroup> */}


        <CButton loading={mutation.isPending || imgUploading} contained onClick={handleUpdate}>
          Update Instructor
        </CButton>
      </Stack>
      <CButton sx={{ mt: 2 }} onClick={() => setDeleteDialogOpen(true)} color='error' >Delete</CButton>


      {/* delete dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Instructor</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this instructor?</DialogContentText>
          <DialogContentText color='error'>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <CButton onClick={() => setDeleteDialogOpen(false)}>Cancel</CButton>
          <CButton loading={deleteMutation.isPending} onClick={handleDeleteInstructor} color="error">Delete</CButton>
        </DialogActions>
      </Dialog>
    </Box >
  );
};

export default EditInstructor;
