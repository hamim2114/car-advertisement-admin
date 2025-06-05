import { Alert, Box, Button, CircularProgress, FormControlLabel, FormGroup, Switch, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import apiReq from "../../../utils/axiosReq";
import toast from "react-hot-toast";
import CButton from "../../common/CButton";


const CreateLink = () => {
  const [customName, setCustomName] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('https://');
  const [googleLogin, setGoogleLogin] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');




  // const mutation = useMutation({
  //   mutationFn: (input) => apiReq.post('/course/create', input, { headers: { Authorization: token } }),
  //   onSuccess: (res) => {
  //     toast.success(res.data);
  //     queryClient.invalidateQueries(['course']);
  //     onClose();
  //   },
  //   onError: (error) => {
  //     toast.error(error.response.data);
  //   }
  // });



  const createLinkMutation = useMutation({
    mutationFn: async (linkData) => {
      const response = await apiReq.post('api/links', linkData);
      return response.data;
    },
    onSuccess: (res) => {
      setSuccessMessage(`Link created: /${customName}`);
      setCustomName('');
      setDestinationUrl('');
      toast.success(res);
    },
    onError: (err) => {
      console.log('err', err);
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
      slug: customName,
      destinationUrl: destinationUrl,
      googleLogin: googleLogin
    });
  };
  return (
    <Box sx={{
      bgcolor: '#fff',
      p: 3, borderRadius: '16px',
      minHeight: '100vh'
    }} maxWidth='lg'>
      <Box>
        <Typography variant="h5" gutterBottom>
          Create New Redirect Link
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Slug Name"
            placeholder="e.g. advertisement1"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Destination URL"
            placeholder="e.g. https://client-site.com"
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
            margin="normal"
            required
          />

          <FormGroup>
            <FormControlLabel control={<Switch checked={googleLogin} onChange={(e) => setGoogleLogin(e.target.checked)} />} label="Google Login" />
          </FormGroup>

          <CButton loading={createLinkMutation.isPending} type="submit" variant="contained" sx={{ mt: 3 }}>
            Create Link
          </CButton>
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