import React, { useState } from 'react';
import { TextField, Button, Box, Grid, Typography, MenuItem, Stack, IconButton, Avatar, Autocomplete } from '@mui/material';
import { Close } from '@mui/icons-material';
import CTextField from '../../common/CTextField';
import CButton from '../../common/CButton';
import toast from 'react-hot-toast';
import { axiosReq } from '../../../utils/axiosReq';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hook/useAuth';

const AddResourse = ({ onClose }) => {
  const [payload, setPayload] = useState({
    name: '',
    url: '',
    category: '',
    version: '',
    files: '',
  });

  const { token } = useAuth()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.post('/resourse/create', input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['resourse'])
      onClose()
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!payload.name) return toast.error('name required')
    if (!payload.url) return toast.error('url required')
    if (!payload.category) return toast.error('category required')
    mutation.mutate(payload)
  };

  return (
    <Box>

      <Stack gap={2}>
        <CTextField
          topLabel="Name *"
          size='small'
          name="name"
          value={payload.name}
          onChange={handleChange}
          fullWidth
        />
        <CTextField
          topLabel="File Url *"
          size='small'
          name="url"
          value={payload.url}
          onChange={handleChange}
          fullWidth
        />

        <CTextField
          topLabel="Version"
          size='small'
          name="version"
          value={payload.version}
          onChange={handleChange}
          fullWidth
        />
        <CTextField
          topLabel="Category *"
          size='small'
          name="category"
          value={payload.category}
          onChange={handleChange}
          fullWidth
        />

        <CTextField
          topLabel="Total Files"
          size='small'
          name="files"
          type='number'
          value={payload.files}
          onChange={handleChange}
          fullWidth
        />


        <CButton loading={mutation.isPending} contained onClick={handleSave}>
          Add Resourse
        </CButton>
      </Stack>
    </Box >
  );
};

export default AddResourse;
