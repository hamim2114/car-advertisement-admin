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

  // Fetch link destination and track visit
  useEffect(() => {
    let mounted = true;
    
    const fetchLinkAndTrackVisit = async () => {
      try {
        // First get the link info
        const res = await apiReq.get(`/api/links/${slug}`);
        if (!mounted) return;
        setLinkInfo(res.data);
        console.log('res ', res.data);
        
        // If Google login is not required, redirect immediately
        if (!res.data.googleLogin) {
          window.location.href = res.data.destinationUrl;
        }
        // Only record visit if component is still mounted
        const visitRes = await apiReq.post(`/api/visits/${slug}`);
        if (!mounted || visitRes.data.recorded) return;
        
      } catch (err) {
        if (!mounted) return;
        console.error(err);
        setError('Invalid or expired link');
      }
    };
  
    fetchLinkAndTrackVisit();
  
    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [slug]);

  // scope: 'openid email profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.addresses.read',

  // Google Login hook


  // const testLogin = async () => {
  //   console.log('testLogin');
  //   const email = 'test@test.com';
  //   const birthDay = {
  //     year: 1997,
  //       month: 3,
  //     day: 16
  //   }
  //   await apiReq.post(`/api/emails/${slug}`, { email, birthDay });
  // }

 
  const login = useGoogleLogin({
    scope: 'openid email profile',
    flow: 'implicit',
    onSuccess: async tokenResponse => {
      try {
        setLoading(true);

        const accessToken = tokenResponse.access_token;

        // Call People API
        const res = await axios.get(
          'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses',
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

        // Record email separately from visit tracking
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
      {/* <button onClick={() => testLogin()}>
        Test Login
      </button> */}
      {linkInfo?.googleLogin && (
        <Button variant="contained" onClick={() => login()} disabled={loading}>
          Continue with Google
        </Button>
      )}
      {loading && <Loader />}
    </Box>
  );
};

export default RedirectPage;
