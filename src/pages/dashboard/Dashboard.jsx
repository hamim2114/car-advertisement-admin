import { useState } from 'react'
import { Box, Card, CardContent, Typography, Grid, Stack, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const Dashboard = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  // Mock data - replace with actual data
  const linkStats = [
    {
      id: 1,
      link: 'https://example.com/advertisement1',
      totalVisits: 156,
      visitors: [
        { email: 'user1@example.com', visitDate: '2024-01-15 14:30:00' },
        { email: 'user2@example.com', visitDate: '2024-01-15 15:45:00' },
      ]
    }
  ]

  return (
    <Box maxWidth="xl" sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Link Analytics Dashboard
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  type='date'
                  helperText="Select the start date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
                <TextField
                  type='date'
                  helperText="Select the end date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="contained" fullWidth>Apply Filter</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {linkStats.map((stat) => (
        <Card key={stat.id} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {stat.link}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Visits
                    </Typography>
                    <Typography variant="h4">
                      {stat.totalVisits}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Visitor Email</TableCell>
                    <TableCell>Visit Date & Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stat.visitors.map((visitor, index) => (
                    <TableRow key={index}>
                      <TableCell>{visitor.email}</TableCell>
                      <TableCell>{visitor.visitDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default Dashboard