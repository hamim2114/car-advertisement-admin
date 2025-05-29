import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import apiReq from '../../../utils/axiosReq';
import Loader from '../../common/Loader';
import TopPerformLinks from './TopPerformLinks';
import RecentEmail from './RecentEmail';

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
      p: { xs: 2, sm: 3 },
      borderRadius: '16px',
      minHeight: '100%'
    }} maxWidth='lg'>
      <Typography variant="h4" gutterBottom sx={{
        mb: { xs: 3, sm: 4 },
        fontWeight: 'bold',
        color: 'primary.main',
        fontSize: { xs: '1.5rem', sm: '2rem' }
      }}>
        Analytics Dashboard
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 6} }}>
        <Card sx={{ flex: 1, height: '100%', bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="subtitle1">
              Total Links Created
            </Typography>
            <Typography variant="h3" sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: { xs: '2rem', sm: '2.5rem' }
            }}>
              {data?.data?.totalLinks || 0}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, height: '100%', bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="subtitle1">
              Total Emails Collected
            </Typography>
            <Typography variant="h3" sx={{
              fontWeight: 'bold',
              color: 'info.main',
              fontSize: { xs: '2rem', sm: '2.5rem' }
            }}>
              {data?.data?.totalEmails || 0}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, height: '100%', bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="subtitle1">
              Total Link Visits
            </Typography>
            <Typography variant="h3" sx={{
              fontWeight: 'bold',
              color: 'success.main',
              fontSize: { xs: '2rem', sm: '2.5rem' }
            }}>
              {data?.data?.totalVisits || 0}
            </Typography>
          </CardContent>
        </Card>
        

      </Stack>

      <TopPerformLinks data={data?.data?.topLinks} />
      <RecentEmail data={data?.data?.recentEmails} />
    </Box>
  );
};

export default Dashboard;