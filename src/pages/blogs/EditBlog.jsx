/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, Typography, MenuItem, Stack, IconButton, Avatar, Autocomplete, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Close } from '@mui/icons-material';
import CTextField from '../../common/CTextField';
import CButton from '../../common/CButton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';
import ImageUploader from 'quill-image-uploader';
import 'quill-image-uploader/dist/quill.imageUploader.min.css';
import useAuth from '../../hook/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../../utils/axiosReq';
import toast from 'react-hot-toast';
import { deleteImage, uploadImage } from '../../../utils/upload';

// Quill.register('modules/imageUploader', ImageUploader);

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote'],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }], // Indentation options
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ['link', 'image', 'video'],
    ['clean'], // Remove formatting option
  ],
  // imageUploader: {
  //   upload: (file) => {
  //     // Logic to upload the file to the server and return the URL
  //     return new Promise((resolve, reject) => {
  //       const formData = new FormData();
  //       formData.append('image', file);

  //       // Replace this URL with your API endpoint
  //       fetch('https://api.yoursite.com/upload', {
  //         method: 'POST',
  //         body: formData,
  //       })
  //         .then(response => response.json())
  //         .then(result => {
  //           resolve(result.url); // Resolve with the image URL
  //         })
  //         .catch(() => {
  //           reject('Upload failed');
  //         });
  //     });
  //   }
  // }
};

const EditBlog = ({ onClose, data }) => {
  const [content, setContent] = useState('')
  const [file, setFile] = useState('')
  const [imgUploading, setImgUploading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [payload, setPayload] = useState({
    title: '',
    category: '',
  });

  const { token } = useAuth()

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.put(`/blog/edit/${data._id}`, input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['course']);
      onClose();
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => axiosReq.delete(`/blog/delete/${data._id}`, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['blog']);
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const publicId = data?.image?.split('/').pop().split('.')[0];


  const handleSave = async () => {
    if (!payload.title) return toast.error('Title is required');
    if (!payload.category) return toast.error('Category is required');
    if (!content) return toast.error('Content is required');

    const blogData = {
      ...payload,
      content,
      image: data.image
    };

    if (file) {
      setImgUploading(true);
      deleteImage(publicId)
      const { secure_url } = await uploadImage(file);
      blogData.image = secure_url;
      mutation.mutate(blogData);
      setImgUploading(false);
    } else {
      mutation.mutate(blogData);
    }
  };

  const handleDeleteBlog = () => {
    deleteMutation.mutate()
    deleteImage(publicId)
    setDeleteDialogOpen(false)
    onClose()
  }

  useEffect(() => {
    setPayload(data)
    setContent(data.content)
  }, [data])

  return (
    <Box>

      <Stack gap={2}>
        <Stack direction="row" gap={2} alignItems="center">
          <Avatar src={file ? URL.createObjectURL(file) : data?.image} />
          <input onChange={e => setFile(e.target.files[0])} accept="image/*" hidden id="file" type="file" />
          <label htmlFor="file">
            <Button size='small' component="span">
              Add Image
            </Button>
          </label>
        </Stack>
        <CTextField
          topLabel="Blog Title"
          size='small'
          name="title"
          value={payload.title}
          onChange={handleChange}
        />
        <CTextField
          topLabel="Category"
          size='small'
          name="category"
          value={payload.category}
          onChange={handleChange}
        />

        <Stack mb={{ xs: 5, md: 0 }}>
          <label>Content</label>
          <ReactQuill
            style={{ height: '400px', marginBottom: '70px', borderRadius: '8px' }}
            value={content}
            onChange={e => setContent(e)}
            modules={modules}
            placeholder="Write your blog content here..."
          />
        </Stack>

        <CButton loading={mutation.isPending || imgUploading} contained onClick={handleSave}>
          Update
        </CButton>
        <CButton style={{ alignSelf: 'flex-start' }} color='error' loading={deleteMutation.isPending} onClick={() => setDeleteDialogOpen(true)}>
          Delete this blog
        </CButton>

        {/* delete dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Blog</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this blog?</DialogContentText>
            <DialogContentText color='error'>This action cannot be undone.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <CButton onClick={() => setDeleteDialogOpen(false)}>Cancel</CButton>
            <CButton loading={deleteMutation.isPending} onClick={handleDeleteBlog} color="error">Delete</CButton>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box >
  );
};

export default EditBlog;
