import { Box, Stack, Typography, Paper, Divider, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import apiReq from '../../../utils/axiosReq';
import { useParams, useNavigate } from 'react-router-dom';
import CDialog from '../../common/CDialog';
import UpdateLinks from '../redirectLinks/UpdateLinks';
import { Edit as EditIcon, Link as LinkIcon, Email as EmailIcon, Visibility as VisibilityIcon, ArrowBack, Download as DownloadIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const RedirectLinkSingle = () => {
  const { slug } = useParams();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLinkData, setEditLinkData] = useState(null);
  const [filters, setFilters] = useState({ from: '', to: '' });
  const navigate = useNavigate();

  const queryUrl = `api/links/${slug}?from=${filters.from}&to=${filters.to}`;

  const { data, refetch } = useQuery({
    queryFn: async () => await apiReq.get(queryUrl),
    queryKey: ['link', slug, filters]
  });
  console.log(data?.data);
  const handleEdit = () => {
    setEditDialogOpen(true);
    setEditLinkData(data?.data);
  };

  const handleExport = async () => {
    const response = await apiReq.get(
      `api/links/${slug}?from=${filters.from}&to=${filters.to}&groupBy=${filters.groupBy}&exportAs=csv`,
      { responseType: 'blob' }
    );
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${slug}_visits.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const emailList = data?.data?.emailList || [];

  return (
    <Box sx={{ bgcolor: '#fff', p: 4, borderRadius: '24px', minHeight: '100vh', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} maxWidth='lg'>
      {/* <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <IconButton onClick={handleEdit} color="primary" sx={{ bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#1976d2', color: 'white' } }}>
          <EditIcon />
        </IconButton>
      </Stack> */}

      <Stack spacing={4}>
        <Box sx={{ p: 3, borderRadius: 3, border: '1px solid #eee' }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            {/* <LinkIcon sx={{ color: '#1976d2' }} /> */}
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
                style={{ textDecoration: 'none', color: '#1976d2', wordBreak: 'break-all' }}
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
                {emailList?.length}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">Unique Emails</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} mt={4}>
            <TextField
              size="small"
              type="date"
              label="From"
              InputLabelProps={{ shrink: true }}
              value={filters.from}
              onChange={e => setFilters({ ...filters, from: e.target.value })}
            />
            <TextField
              size="small"
              type="date"
              label="To"
              InputLabelProps={{ shrink: true }}
              value={filters.to}
              onChange={e => setFilters({ ...filters, to: e.target.value })}
            />

            <Button variant="contained" size="small" onClick={() => refetch()}>Apply Filters</Button>
            <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExport}>Export CSV</Button>
          </Stack>
        </Box>

        <Box sx={{ p: 3, borderRadius: 3, border: '1px solid #eee' }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <EmailIcon sx={{ color: '#1976d2' }} />
            <Typography variant="h6" fontWeight="500">Email Collection</Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          {emailList.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Visits</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {emailList.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item?.email}</TableCell>
                      <TableCell>{format(item?.visitedAt, 'dd MMM yyyy HH:mm a')}</TableCell>
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
  );
};

export default RedirectLinkSingle;
