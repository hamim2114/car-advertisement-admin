import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import apiReq from '../../../utils/axiosReq';
import { Box, Button } from '@mui/material';
import Loader from '../../common/Loader';

const RedirectPage = () => {
  const { slug } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkInfo, setLinkInfo] = useState(null);

  // Fetch link destination first
  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await apiReq.get(`/api/links/${slug}`);
        setLinkInfo(res.data);
      } catch (err) {
        setError('Invalid or expired link');
      }
    };

    fetchLink();
  }, [slug]);

  // Google Login hook
  const login = useGoogleLogin({
    scope: 'openid email profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.addresses.read',
    flow: 'implicit',
    onSuccess: async tokenResponse => {
      try {
        setLoading(true);

        const accessToken = tokenResponse.access_token;

        // Call People API
        const res = await axios.get(
          'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,birthdays,phoneNumbers,addresses',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = res.data;
        const email = data.emailAddresses?.[0]?.value;

        if (!email) {
          throw new Error('Email not found in Google profile');
        }
        console.log(data);
        // Optional: log extra info
        // console.log('Birthday:', data.birthdays?.[0]?.date);
        // console.log('Phone:', data.phoneNumbers?.[0]?.value);
        // console.log('Address:', data.addresses?.[0]?.formattedValue);

        // Send email to backend
        await apiReq.post(`/api/emails/${slug}`, { email });

        // Redirect
        window.location.href = linkInfo.destinationUrl;
      } catch (err) {
        console.error(err);
        setError('Something went wrong while logging in or fetching profile.');
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-in was cancelled or failed.');
    },
  });

  if (error) {
    return (
      <Box sx={{ p: 2, color: 'error.main', textAlign: 'center' }}>
        {error}
      </Box>
    );
  }

  if (!linkInfo) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        p: 2,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Button variant="contained" onClick={() => login()} disabled={loading}>
        Continue with Google
      </Button>
      {loading && <Loader />}
    </Box>
  );
};

export default RedirectPage;
