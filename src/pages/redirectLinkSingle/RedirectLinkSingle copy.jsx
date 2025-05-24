import { Box, Stack, Typography, Paper, Divider, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import apiReq from '../../../utils/axiosReq';
import { useParams, useNavigate } from 'react-router-dom';
import CDialog from '../../common/CDialog';
import UpdateLinks from '../redirectLinks/UpdateLinks';
import { Edit as EditIcon, Link as LinkIcon, Email as EmailIcon, Visibility as VisibilityIcon, ArrowBack } from '@mui/icons-material';

const RedirectLinkSingle = () => {
  const { slug } = useParams();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLinkData, setEditLinkData] = useState(null);

  const navigate = useNavigate();

  const { data } = useQuery({
    queryFn: async () => await apiReq.get(`api/links/${slug}`),
    queryKey: ['link', slug]
  });
  console.log(data?.data);
  const handleEdit = () => {
    setEditDialogOpen(true);
    setEditLinkData(data?.data);
  }

  return (
    <Box sx={{
      bgcolor: '#fff',
      p: 4,
      borderRadius: '24px',
      minHeight: '100vh',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }} maxWidth='lg'>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <IconButton onClick={handleEdit} color="primary" sx={{ bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#1976d2', color: 'white' } }}>
          <EditIcon />
        </IconButton>
      </Stack>

      <Stack spacing={4}>
        <Box sx={{ p: 3, borderRadius: 3, border: '1px solid #eee' }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <LinkIcon sx={{ color: '#1976d2' }} />
            <Typography variant="h6" fontWeight="500">Link Information</Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>Slug</Typography>
              <Chip label={data?.data?.slug} sx={{ fontSize: '1rem', py: 2 }} />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>Destination URL</Typography>
              <a
                href={data?.data?.destinationUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: 'none',
                  color: '#1976d2',
                  wordBreak: 'break-all'
                }}
              >
                {data?.data?.destinationUrl}
              </a>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ p: 3, borderRadius: 3, border: '1px solid #eee' }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <VisibilityIcon sx={{ color: '#1976d2' }} />
            <Typography variant="h6" fontWeight="500">Analytics</Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Stack direction="row" spacing={4}>
            <Box flex={1} sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="#1976d2">
                {data?.data?.totalVisits || 0}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">Total Visits</Typography>
            </Box>

            <Box flex={1} sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="#1976d2">
                {data?.data?.uniqueEmails || 0}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">Unique Emails</Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ p: 3, borderRadius: 3, border: '1px solid #eee' }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <EmailIcon sx={{ color: '#1976d2' }} />
            <Typography variant="h6" fontWeight="500">Email Collection</Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          {data?.data?.emailList?.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Email Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.data.emailList.map((email, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary" fontStyle="italic">
              No emails collected yet
            </Typography>
          )}
        </Box>
      </Stack>

      <CDialog closeButton title='Edit Link' open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <UpdateLinks linkData={editLinkData} closeDialog={() => setEditDialogOpen(false)} />
      </CDialog>

    </Box>
  )
}

export default RedirectLinkSingle