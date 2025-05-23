import { Autocomplete, Avatar, Box, Button, Collapse, FormControl, IconButton, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';
import ImageUploader from 'quill-image-uploader';
import 'quill-image-uploader/dist/quill.imageUploader.min.css';
import { Add, Close, Delete, KeyboardArrowDownOutlined, Upload } from '@mui/icons-material';
import CButton from '../../../common/CButton';
import CTextField from '../../../common/CTextField';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../../../utils/axiosReq';
import useAuth from '../../../hook/useAuth';
import toast from 'react-hot-toast';
import { uploadImage } from '../../../../utils/upload';

const quillModules = {
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
};

const AddInfo = ({ onClose }) => {
  const [payload, setPayload] = useState({
    title: '',
    category: '',
    instructor: '',
    price: '',
    startDate: '',
    endDate: '',
    description: '',
    status: 'pending'
  });
  const [batchInfo, setBatchInfo] = useState([]);
  const [includes, setIncludes] = useState([]);
  const [file, setFile] = useState(null);

  const [errors, setErrors] = useState({});
  const [batchInfoPayload, setBatchInfoPayload] = useState({ title: '', description: '' });
  const [addBatchInfoSecOpen, setAddBatchInfoSecOpen] = useState(false);
  const [includesInCourseSecOpen, setIncludesInCourseSecOpen] = useState(false);
  const [includesTitle, setIncludesTitle] = useState('');
  const [imgUploading, setImgUploading] = useState(false);

  const { token } = useAuth()

  const { data: categories } = useQuery({
    queryKey: ['category'],
    queryFn: () => axiosReq.get('/category/all'),
  })

  const { data: instructors, isLoading } = useQuery({
    queryKey: ['instructor'],
    queryFn: () => axiosReq.get('/instructor/all')
  })

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.post('/course/create', input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['course']);
      onClose();
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const handleAddBatch = () => {
    if (batchInfoPayload.title && batchInfoPayload.description) {
      setBatchInfo([...batchInfo, { ...batchInfoPayload }]);
      setBatchInfoPayload({ title: '', description: '' });
    }
  };

  const handleDeleteBatch = index => {
    setBatchInfo(batchInfo?.filter((_, i) => i !== index));
  };

  const handleAddIncludes = () => {
    if (includesTitle) {
      setIncludes([...includes, includesTitle]);
      setIncludesTitle('');
    }
  };

  const handleDeleteIncludes = index => {
    setIncludes(includes?.filter((_, i) => i !== index));
  };

  const handleSaveCourseInfo = () => {

    const validateForm = () => {
      const newErrors = {};
      if (!payload.title) newErrors.title = 'Title is required';
      if (!payload.category) newErrors.category = 'Category is required';
      if (!payload.instructor) newErrors.instructor = 'Instructor is required';
      if (!payload.price) newErrors.price = 'Price is required';
      if (!payload.startDate) newErrors.startDate = 'Start Date is required';
      if (!payload.endDate) newErrors.endDate = 'End Date is required';
      // if (batchInfo.length === 0) newErrors.batchInfo = 'Please add at least one batch info';
      // if (includes.length === 0) newErrors.includes = 'Includes is required';
      if (!payload.description) newErrors.description = 'Description is required';
      if (!file) newErrors.file = 'Image is required';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    if (!validateForm()) {
      return;
    }

    const courseData = {
      ...payload,
      batchInfo,
      includes,
      cover: ''
    };

    if (file) {
      setImgUploading(true);
      uploadImage(file)
        .then(({ secure_url }) => {
          courseData.cover = secure_url;
          mutation.mutate(courseData);
        })
        .finally(() => setImgUploading(false));
    } else {
      mutation.mutate(courseData);
    }
  }

  return (
    <Stack maxWidth='md' flex={1.5} gap={2}>
      <CTextField
        value={payload.title}
        onChange={e => setPayload({ ...payload, title: e.target.value })}
        size='small'
        topLabel='Title'
        error={!!errors.title}
        helperText={errors.title}
      />
      <FormControl size='small' fullWidth error={!!errors.category}>
        <label>Category</label>
        <Select
          value={payload.category}
          onChange={e => setPayload({ ...payload, category: e.target.value })}
        >
          {
            categories?.data.map(category => (
              <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
            ))
          }
        </Select>
        {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}
      </FormControl>
      {/* instructors */}
      <Autocomplete
        size='small'
        loading={isLoading}
        options={instructors?.data || []}
        onChange={(e, value) => setPayload({ ...payload, instructor: value._id })}
        getOptionLabel={option => option.username}
        renderOption={(props, option) => (
          <li {...props}>
            <Stack direction='row' gap={1} alignItems='center'>
              <Avatar src={option.img || '/no-image.png'} />
              <Box>
                <Typography>{option.username}</Typography>
                <Typography sx={{ fontSize: '12px' }}>{option.email}</Typography>
              </Box>
            </Stack>
          </li>
        )}
        renderInput={params => (
          <TextField
            {...params}
            label="Added for (Instructor)"
            error={!!errors.instructor}
            helperText={errors.instructor}
          />
        )}
      />
      <CTextField
        value={payload.price}
        onChange={e => setPayload({ ...payload, price: e.target.value })}
        type='number'
        size='small'
        topLabel='Price'
        error={!!errors.price}
        helperText={errors.price}
      />
      <Stack direction='row' gap={2}>
        <CTextField
          value={payload.startDate}
          onChange={e => setPayload({ ...payload, startDate: e.target.value })}
          size='small'
          type='date'
          topLabel='Start Date'
          error={!!errors.startDate}
          helperText={errors.startDate}
        />
        <CTextField
          value={payload.endDate}
          onChange={e => setPayload({ ...payload, endDate: e.target.value })}
          size='small'
          type='date'
          topLabel='End Date'
          error={!!errors.endDate}
          helperText={errors.endDate}
        />
      </Stack>

      {/* Add Batch Information */}
      <CollapsibleSection
        title="Add Batch Information"
        isOpen={addBatchInfoSecOpen}
        setIsOpen={setAddBatchInfoSecOpen}
      >
        <CTextField
          size='small'
          fullWidth
          topLabel="Title"
          value={batchInfoPayload.title}
          onChange={e => setBatchInfoPayload({ ...batchInfoPayload, title: e.target.value })}
        />
        <CTextField
          sx={{ mb: 2 }}
          size='small'
          fullWidth
          topLabel="Description"
          value={batchInfoPayload.description}
          onChange={e => setBatchInfoPayload({ ...batchInfoPayload, description: e.target.value })}
        />
        <CButton
          outlined
          fullWidth
          startIcon={<Add />}
          onClick={handleAddBatch}
        >
          Add
        </CButton>
        <Box>
          {batchInfo.map((batch, index) => (
            <InfoItem
              key={index}
              title={batch.title}
              description={batch.description}
              onDelete={() => handleDeleteBatch(index)}
            />
          ))}
        </Box>
        {errors.batchInfo && <Typography color="error" variant="caption">{errors.batchInfo}</Typography>}
      </CollapsibleSection>

      {/* include in course */}
      <CollapsibleSection
        title="Includes in Course"
        isOpen={includesInCourseSecOpen}
        setIsOpen={setIncludesInCourseSecOpen}
      >
        <CTextField
          size='small'
          fullWidth
          topLabel="Title"
          value={includesTitle}
          onChange={e => setIncludesTitle(e.target.value)}
        />
        <CButton
          sx={{ mt: 2 }}
          outlined
          startIcon={<Add />}
          onClick={handleAddIncludes}
        >
          Add
        </CButton>
        <Box>
          {includes.map((item, index) => (
            <InfoItem
              key={index}
              title={item}
              onDelete={() => handleDeleteIncludes(index)}
            />
          ))}
        </Box>
        {errors.includes && <Typography color="error" variant="caption">{errors.includes}</Typography>}
      </CollapsibleSection>

      <Stack mb={{ xs: 5, md: 0 }}>
        <label>Description</label>
        <ReactQuill
          style={{ height: '400px', marginBottom: '50px', borderRadius: '8px' }}
          value={payload.description}
          onChange={(e) => setPayload({ ...payload, description: e })}
          modules={quillModules}
          placeholder="Write Description here..."
        />
        {errors.description && <Typography color="error" variant="caption">{errors.description}</Typography>}
      </Stack>

      <Stack>
        <Typography>Course Image</Typography>
        <Stack sx={{
          position: 'relative',
          border: '1px solid lightgray',
          p: '20px',
          borderRadius: '8px',
          minHeight: '200px'
        }} direction={{ xs: 'column', md: 'row' }} gap={3}>
          {file && (
            <>
              <Box flex={1}>
                <img
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  src={URL.createObjectURL(file)}
                  alt=""
                />
              </Box>
              <IconButton
                onClick={() => setFile(null)}
                sx={{
                  position: 'absolute',
                  border: '1px solid lightgray',
                  bgcolor: '#fff',
                  top: 5,
                  left: 5,
                  ":hover": {
                    bgcolor: 'gray'
                  }
                }}
              >
                <Close />
              </IconButton>
            </>
          )}
          <Stack alignItems='center' justifyContent='center' gap={1} flex={1}>
            <Typography>jpg, png (max 500kb)</Typography>
            <Button variant='outlined' component='label' startIcon={<Upload />}>
              Click to upload
              <input onChange={e => setFile(e.target.files[0])} type="file" hidden />
            </Button>
          </Stack>
          {errors.file && <Typography color="error" variant="caption">{errors.file}</Typography>}
        </Stack>
      </Stack>
      <CButton loading={mutation.isPending || imgUploading} onClick={handleSaveCourseInfo} contained>Save Course Info</CButton>
    </Stack>
  );
};

const CollapsibleSection = ({ title, isOpen, setIsOpen, children }) => (
  <Stack sx={{ borderRadius: '8px', border: '1px solid lightgray' }}>
    <CButton endIcon={<KeyboardArrowDownOutlined />} onClick={() => setIsOpen(!isOpen)}>
      {title}
    </CButton>
    <Collapse sx={{ m: isOpen ? 2 : '' }} in={isOpen}>
      {children}
    </Collapse>
  </Stack>
);

const InfoItem = ({ title, description, onDelete }) => (
  <Paper sx={{
    padding: '15px',
    mt: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <Box>
      <Typography variant="subtitle1">{title}</Typography>
      {description && (
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      )}
    </Box>
    <IconButton onClick={onDelete}>
      <Delete />
    </IconButton>
  </Paper>
);

export default AddInfo;