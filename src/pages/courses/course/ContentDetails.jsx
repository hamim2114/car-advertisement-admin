/* eslint-disable react/prop-types */
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Stack, Typography } from '@mui/material'
import CButton from '../../../common/CButton'
import { useState } from 'react';
import CDialog from '../../../common/CDialog';
import AddContent from './AddContent';
import { AccessTime, ExpandMore, PictureAsPdf, PlayArrow } from '@mui/icons-material';
import EditContent from './EditContent';
import { axiosReq } from '../../../../utils/axiosReq';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hook/useAuth';
import { format } from 'date-fns';

const ContentDetails = ({ course }) => {
  const { token } = useAuth()
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedContent, setExpandedContent] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { data: contentData } = useQuery({
    queryKey: ['content', course._id],
    queryFn: async () => {
      const response = await axiosReq.get(`/course/content/${course._id}`, { headers: { Authorization: token } });
      return response.data;
    },
  });

  const handleSectionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : null);
  };

  const handleContentChange = (panel) => (event, isExpanded) => {
    setExpandedContent(isExpanded ? panel : null);
  };

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between'>
        <Box />
        {
          contentData?.sections?.length > 0 ?
            <CButton onClick={() => setEditDialogOpen(true)} contained>Update Content</CButton>
            :
            <CButton onClick={() => setAddDialogOpen(true)} contained>Add New Content</CButton>
        }
      </Stack>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Course Content
      </Typography>
      {
        !contentData && <Typography>No content available.</Typography>
      }
      {
        contentData && <>
          <Chip sx={{ my: 2, px: 3 }} label={`Status: ${contentData?.status}`} color={contentData?.status === 'published' ? 'success' : contentData?.status === 'archived' ? 'default' : 'warning'} />
          {contentData?.createdAt && <Typography> <b>Created:</b> {format(new Date(contentData?.createdAt), 'dd MMMM yyyy')}</Typography>}
          {contentData?.lastUpdated && <Typography> <b>Updated:</b> {format(new Date(contentData?.lastUpdated), 'dd MMMM yyyy')}</Typography>}
          <Typography sx={{ mb: 4 }}> <b>Total Video Duration:</b> {contentData?.totalVideoDuration} minutes</Typography>
        </>
      }

      {contentData?.sections.map((section) => (
        <Accordion
          key={section._id}
          sx={{ mb: 2, maxWidth: '900px', boxShadow: 0, border: '1px solid lightgray', borderRadius: 2 }}
          expanded={expandedSection === section._id}
          onChange={handleSectionChange(section._id)}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              <b>{section.order}. </b> {section.title}
            </Typography>
            {/* <Typography variant="body2" sx={{ ml: 2, fontWeight: 300, display: 'flex', gap: 1, alignItems: 'center' }}>
              (Est. Duration: {section.estimatedDuration} mins)
            </Typography> */}
          </AccordionSummary>
          <AccordionDetails>
            {section.content.map((item) => (
              <Accordion
                key={item._id}
                sx={{ mb: 2, boxShadow: 0, border: '1px solid lightgray', borderRadius: 2 }}
                expanded={expandedContent === item._id}
                onChange={handleContentChange(item._id)}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    <b>{item.order}. </b> {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2, fontWeight: 300, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <AccessTime fontSize='small' /> {item.duration} mins
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ mb: 1, border: '1px solid lightgray', px: 1, borderRadius: 2, width: 'fit-content' }}>
                    Type: {item.type}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {item.description}
                  </Typography>

                  {item.type === 'video' ? (
                    <Box>
                      <Button
                        size='small'
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => setSelectedVideo(item.url)}
                      >
                        Play
                      </Button>
                      {selectedVideo === item.url && (
                        <Box sx={{ mt: 2 }}>
                          <iframe
                            width="100%"
                            height="412"
                            src={`https://www.youtube.com/embed/${item.url.split('v=')[1].split('&')[0]}?modestbranding=1&rel=0&controls=1&disablekb=1`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={item.title}
                          ></iframe>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box>
                      <Button
                        size='small'
                        variant="contained"
                        startIcon={<PictureAsPdf />}
                        href={item.url}
                        target="_blank"
                      // rel="noopener noreferrer"
                      >
                        Download
                      </Button>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      <CDialog disableOutsideClick maxWidth='md' title='Add New Content' open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <AddContent course={course} onClose={() => setAddDialogOpen(false)} />
      </CDialog>

      <CDialog disableOutsideClick maxWidth='md' title='Update Content' open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <EditContent content={contentData} course={course} onClose={() => setEditDialogOpen(false)} />
      </CDialog>
    </Box>
  )
}

export default ContentDetails
