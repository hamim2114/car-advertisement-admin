import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import apiReq from '../../../utils/axiosReq';
import Loader from '../../common/Loader';

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await apiReq.get('api/dashboard'),
    queryKey: ['dashboard']
  });

  if (isLoading) return <Loader />;
  if (isError) return <Typography color="error">Error loading dashboard data</Typography>;

  return (
    <Box sx={{
      bgcolor: '#fff',
      p: 3, borderRadius: '16px',
      minHeight: '100vh'
    }} maxWidth='lg'>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%', bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle1">
                Total Links Created
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {data?.data?.totalLinks || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%', bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle1">
                Total Link Visits
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {data?.data?.totalVisits || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%', bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle1">
                Total Emails Collected
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {data?.data?.totalEmails || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Top Performing Links
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Slug</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Destination</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Visits</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.data?.topLinks.map((link) => (
                      <TableRow key={link._id} hover>
                        <TableCell>
                          <RouterLink
                            to={`redirect-links/${link.slug}`}
                            style={{
                              textDecoration: 'none',
                              color: '#1976d2',
                              fontWeight: 500
                            }}
                          >
                            {link.slug}
                          </RouterLink>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {link.destinationUrl}
                        </TableCell>
                        <TableCell align="right">{link.visits}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Recent Email Captures
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Link</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Captured At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.data?.recentEmails.map((email) => (
                      <TableRow key={email._id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{email.email}</TableCell>
                        <TableCell>
                          <RouterLink
                            to={`redirect-links/${email.link.slug}`}
                            style={{
                              textDecoration: 'none',
                              color: '#1976d2',
                              fontWeight: 500
                            }}
                          >
                            {email.link.slug}
                          </RouterLink>
                        </TableCell>
                        <TableCell>{new Date(email.visitedAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;