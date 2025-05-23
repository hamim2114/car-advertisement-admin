import React, { useState } from 'react';
import { TextField, Button, IconButton, Typography, Stack } from '@mui/material';
import { Add as AddIcon, Close } from '@mui/icons-material';
import CTextField from '../../../common/CTextField';
import toast from 'react-hot-toast';
import useAuth from '../../../hook/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../../../utils/axiosReq';
import CButton from '../../../common/CButton';
import { uploadImage } from '../../../../utils/upload';

const AddCategory = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [subCategory, setSubCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [imgUploading, setImgUploading] = useState(false);

  const { token } = useAuth()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.post('/category/create', input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      onClose()
      queryClient.invalidateQueries(['category'])
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  function handleSubCategory() {
    if (subCategory === '') {
      toast.error('Please write a subcategory name')
      return
    }
    if (subCategory.trim()) {
      setSubCategories([...subCategories, subCategory]);
      setSubCategory('');
    }
  }

  const handleRemoveSubCategory = (index) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories.splice(index, 1);
    setSubCategories(updatedSubCategories);
  };

  const handleSave = async () => {
    if (categoryName === '') {
      toast.error('Please write a category name')
      return
    }
    let imgUrl = ''
    if (file) {
      setImgUploading(true)
      const { secure_url } = await uploadImage(file);
      imgUrl = secure_url;
      setImgUploading(false)
    }
    mutation.mutate({
      name: categoryName,
      description,
      subCategories,
      img: imgUrl
    })
  };

  return (
    <Stack gap={2}>

      <CTextField
        size='small'
        topLabel="Category Name"
        variant="outlined"
        fullWidth
        required
        value={categoryName}
        onChange={e => setCategoryName(e.target.value)}
      />

      <CTextField
        size='small'
        topLabel="Description"
        variant="outlined"
        multiline
        rows={4}
        fullWidth
        required
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <Stack direction='row' gap={2} alignItems='center'>
        <Button
          variant="outlined"
          component="label"
        >
          Choose Thumbnail
          <input
            type="file"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>
        {file &&
          <img
            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
            src={URL.createObjectURL(file)}
            alt="Thumbnail"
          />
        }
      </Stack>

      <Stack direction='row' flex={1} gap={2} alignItems='center'>
        <TextField
          onChange={e => setSubCategory(e.target.value)}
          size='small'
          value={subCategory}
          label="Subcategory"
          variant="outlined"
          fullWidth
        />
        <IconButton
          sx={{
            border: '1px solid lightgray',
            borderRadius: '4px',
          }}
          color="primary"
          onClick={handleSubCategory}
        >
          <AddIcon />
        </IconButton>
      </Stack>

      <Stack direction='row' flexWrap='wrap' gap={2}>
        {
          subCategories.map((item, index) => (
            <Typography
              key={index}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                border: '1px solid lightgray',
                px: 0.5,
                borderRadius: '4px'
              }}
            >
              {item}
              <IconButton
                size='small'
                onClick={() => handleRemoveSubCategory(index)}
              >
                <Close fontSize='small' />
              </IconButton>
            </Typography>
          ))
        }
      </Stack>

      <CButton loading={mutation.isPending || imgUploading} variant="contained" color="primary" onClick={handleSave}>
        Save Category
      </CButton>
    </Stack>
  );
};

export default AddCategory;
