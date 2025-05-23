import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";


const CreateLink = () => {
  const [customName, setCustomName] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const createLinkMutation = useMutation({
    mutationFn: async (linkData) => {
      const response = await axios.post('http://localhost:5000/api/links', linkData);
      return response.data;
    },
    onSuccess: () => {
      setSuccessMessage(`Link created: /${customName}`);
      setCustomName('');
      setDestinationUrl('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customName || !destinationUrl) {
      setError('Please fill in all fields.');
      return;
    }
    setSuccessMessage('');
    setError('');
    
    createLinkMutation.mutate({
      customName,
      destinationUrl,
    });
  };
  return (
    <Box sx={{
      bgcolor: '#fff',
      p: 3, borderRadius: '16px',
      minHeight: '100vh'
  }} maxWidth='md'>
    <Box>
      <Typography variant="h5" gutterBottom>
        Create New Redirect Link
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Custom Name (e.g., advertisement1)"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Destination URL (e.g., https://client-site.com)"
          value={destinationUrl}
          onChange={(e) => setDestinationUrl(e.target.value)}
          margin="normal"
          required
        />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            Create Link
          </Button>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  </Box>
  )
};

export default CreateLink;