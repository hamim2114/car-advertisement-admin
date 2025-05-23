/* eslint-disable react/prop-types */
import { useState } from 'react';
import { TextField, Button, Box, IconButton, Typography, Collapse, Paper, Stack, MenuItem, Select, FormControlLabel, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CButton from '../../../common/CButton';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../../../utils/axiosReq';
import useAuth from '../../../hook/useAuth';

const AddContent = ({ course, onClose }) => {
  const [sections, setSections] = useState([{
    title: '',
    description: '',
    order: 1,
    content: [{
      title: '',
      description: '',
      type: 'video',
      url: '',
      duration: 0,
      fileSize: 0,
      isOptional: false,
      order: 1
    }],
    estimatedDuration: 0
  }]);
  const [editingSection, setEditingSection] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const [openContent, setOpenContent] = useState(null);

  const { token } = useAuth()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.post(`/course/create/content/${course._id}`, input, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data);
      queryClient.invalidateQueries(['content', course._id]);
      onClose()
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });

  const addSection = () => {
    if (sections[sections.length - 1].title.trim() === '') {
      toast.error('Please fill in the title for the current section before adding a new one.');
      return;
    }
    setSections([...sections, {
      title: '',
      description: '',
      order: sections.length + 1,
      content: [{
        title: '',
        description: '',
        type: 'video',
        url: '',
        duration: 0,
        // fileSize: 0,
        isOptional: false,
        order: 1
      }],
      estimatedDuration: 0
    }]);
    setEditingSection(sections.length);
    setOpenSection(sections.length);
  };

  const addContent = (sectionIndex) => {
    const newSections = [...sections];
    const lastContent = newSections[sectionIndex].content[newSections[sectionIndex].content.length - 1];
    if (lastContent.title.trim() === '' || lastContent.url.trim() === '') {
      toast.error('Please fill in all required fields for the current content before adding a new one.');
      return;
    }
    newSections[sectionIndex].content.push({
      title: '',
      description: '',
      type: 'video',
      url: '',
      duration: 0,
      // fileSize: 0,
      isOptional: false,
      order: newSections[sectionIndex].content.length + 1
    });
    setSections(newSections);
    setEditingContent({ section: sectionIndex, content: newSections[sectionIndex].content.length - 1 });
    setOpenSection(sectionIndex);
    setOpenContent(newSections[sectionIndex].content.length - 1);
  };

  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
    if (editingSection === index) setEditingSection(null);
    if (openSection === index) setOpenSection(null);
  };

  const removeContent = (sectionIndex, contentIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].content = newSections[sectionIndex].content.filter((_, i) => i !== contentIndex);
    setSections(newSections);
    if (editingContent?.section === sectionIndex && editingContent?.content === contentIndex) {
      setEditingContent(null);
    }
    if (openContent === contentIndex) setOpenContent(null);
  };

  const handleInputChange = (sectionIndex, contentIndex, field, value) => {
    const newSections = [...sections];
    if (contentIndex === null) {
      newSections[sectionIndex][field] = value;
    } else {
      newSections[sectionIndex].content[contentIndex][field] = value;
      if (field === 'duration') {
        newSections[sectionIndex].estimatedDuration = newSections[sectionIndex].content.reduce((total, item) => total + (item.duration || 0), 0);
      }
    }
    setSections(newSections);
  };

  const toggleSection = (index) => setOpenSection(openSection === index ? null : index);
  const toggleContent = (index) => setOpenContent(openContent === index ? null : index);
  const toggleEdit = (sectionIndex, contentIndex) => {
    if (contentIndex === null) {
      setEditingSection(editingSection === sectionIndex ? null : sectionIndex);
    } else {
      setEditingContent(editingContent?.section === sectionIndex && editingContent?.content === contentIndex
        ? null
        : { section: sectionIndex, content: contentIndex });
    }
  };

  const handleSave = () => {
    const hasEmptyFields = sections.some(section =>
      section.title.trim() === '' ||
      section.content.some(content =>
        content.title.trim() === '' ||
        content.url.trim() === ''
      )
    );

    if (hasEmptyFields) {
      toast.error('Please fill in all required fields before saving.');
      return;
    }

    // const totalVideoDuration = sections.reduce((total, section) =>
    //   total + section.content.reduce((sectionTotal, content) =>
    //     sectionTotal + (content.type === 'video' ? content.duration : 0), 0), 0);

    mutation.mutate({
      sections: sections,
      status: 'pending'
    });
  };

  return (
    <Box maxWidth='md'>
      <Stack direction='row' justifyContent='space-between' mt={1} mb={3}>
        <Box />
        <CButton loading={mutation.isPending} contained onClick={handleSave}>Save Course Content</CButton>
      </Stack>
      {sections.map((section, sectionIndex) => (
        <Paper key={sectionIndex} elevation={3} sx={{ mb: 2, p: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" onClick={() => toggleSection(sectionIndex)} sx={{ cursor: 'pointer', flexGrow: 1 }}>
              <b>{section.order}. </b> {section.title || 'Untitled Section'}
              {openSection === sectionIndex ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Typography>
            <IconButton disabled={sections.length === 1} color="error" onClick={() => removeSection(sectionIndex)}><DeleteIcon /></IconButton>
          </Box>
          <Collapse in={openSection === sectionIndex}>
            {editingSection === sectionIndex ? (
              <Box display='flex' flexDirection='column' mt={2}>
                <TextField
                  label="Section Title"
                  value={section.title}
                  onChange={(e) => handleInputChange(sectionIndex, null, 'title', e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Section Description"
                  value={section.description}
                  onChange={(e) => handleInputChange(sectionIndex, null, 'description', e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Order"
                  type="number"
                  value={section.order}
                  onChange={(e) => handleInputChange(sectionIndex, null, 'order', parseInt(e.target.value))}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Button color="primary" onClick={() => toggleEdit(sectionIndex, null)}>Save</Button>
              </Box>
            ) : (
              <Box mt={2}>
                <Typography variant="body1"><strong>Title:</strong> {section.title || 'No Title'}</Typography>
                <Typography variant="body1"><strong>Description:</strong> {section.description || 'No Description'}</Typography>
                <Typography variant="body1"><strong>Order:</strong> {section.order}</Typography>
                <Typography variant="body1"><strong>Estimated Duration:</strong> {section.estimatedDuration} minutes</Typography>
                <IconButton color="primary" onClick={() => toggleEdit(sectionIndex, null)}><EditIcon fontSize='small' /></IconButton>
              </Box>
            )}

            {section.content.map((content, contentIndex) => (
              <Paper key={contentIndex} elevation={2} sx={{ mt: 2, p: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="body1" onClick={() => toggleContent(contentIndex)} sx={{ cursor: 'pointer', flexGrow: 1 }}>
                    {content.title || 'Untitled Content'}
                    {openContent === contentIndex ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Typography>
                  <IconButton disabled={section.content.length === 1} color="error" onClick={() => removeContent(sectionIndex, contentIndex)}><DeleteIcon /></IconButton>
                </Box>
                <Collapse in={openContent === contentIndex}>
                  {editingContent?.section === sectionIndex && editingContent?.content === contentIndex ? (
                    <Box mt={2}>
                      <TextField
                        label="Title"
                        value={content.title}
                        onChange={(e) => handleInputChange(sectionIndex, contentIndex, 'title', e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Description"
                        value={content.description}
                        onChange={(e) => handleInputChange(sectionIndex, contentIndex, 'description', e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Select
                        value={content.type}
                        onChange={(e) => handleInputChange(sectionIndex, contentIndex, 'type', e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        <MenuItem value="video">Video</MenuItem>
                        <MenuItem value="document">Document</MenuItem>
                      </Select>
                      <TextField
                        label="URL"
                        value={content.url}
                        onChange={(e) => handleInputChange(sectionIndex, contentIndex, 'url', e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Duration (minutes)"
                        type="number"
                        value={content.duration}
                        onChange={(e) => handleInputChange(sectionIndex, contentIndex, 'duration', parseInt(e.target.value))}
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      {/* <TextField
                        label="File Size (KB)"
                        type="number"
                        value={content.fileSize}
                        onChange={(e) => handleInputChange(sectionIndex, contentIndex, 'fileSize', parseInt(e.target.value))}
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                      /> */}
                      <Stack direction='row' gap={2} justifyContent='space-between'>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={content.isOptional}
                              onChange={(e) => handleInputChange(sectionIndex, contentIndex, 'isOptional', e.target.checked)}
                            />
                          }
                          label="Optional"
                        />
                        <TextField
                          size='small'
                          label="Order"
                          type="number"
                          value={content.order}
                          onChange={(e) => handleInputChange(sectionIndex, contentIndex, 'order', parseInt(e.target.value))}
                          variant="outlined"
                        />
                      </Stack>
                      <Button color="primary" onClick={() => toggleEdit(sectionIndex, contentIndex)}>Save</Button>
                    </Box>
                  ) : (
                    <Box mt={2}>
                      <Typography variant="body1"><strong>Title:</strong> {content.title || 'No Title'}</Typography>
                      <Typography variant="body1"><strong>Description:</strong> {content.description || 'No Description'}</Typography>
                      <Typography variant="body1"><strong>Type:</strong> {content.type}</Typography>
                      <Typography variant="body1"><strong>URL:</strong> {content.url || 'No URL'}</Typography>
                      <Typography variant="body1"><strong>Duration:</strong> {content.duration} minutes</Typography>
                      {/* <Typography variant="body1"><strong>File Size:</strong> {content.fileSize} KB</Typography> */}
                      <Typography variant="body1"><strong>Optional:</strong> {content.isOptional ? 'Yes' : 'No'}</Typography>
                      <Typography variant="body1"><strong>Order:</strong> {content.order}</Typography>
                      <IconButton color="primary" onClick={() => toggleEdit(sectionIndex, contentIndex)}><EditIcon /></IconButton>
                    </Box>
                  )}
                </Collapse>
              </Paper>
            ))}
            <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => addContent(sectionIndex)}>
              Add Content
            </Button>
          </Collapse>
        </Paper>
      ))}

      <Button variant="contained" startIcon={<AddIcon />} onClick={addSection}>
        Add Section
      </Button>
    </Box>
  );
};

export default AddContent;