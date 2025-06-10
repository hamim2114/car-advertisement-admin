import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import apiReq from '../../../utils/axiosReq';
import { Box, Button, Typography } from '@mui/material';
import Loader from '../../common/Loader';

const RedirectPage = () => {
  const { slug } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkInfo, setLinkInfo] = useState(null);
  const [isInstagramBrowser, setIsInstagramBrowser] = useState(false);
  const [instagramRedirectInitiated, setInstagramRedirectInitiated] = useState(false);

  // Check for Instagram browser on component mount
  useEffect(() => {
    setIsInstagramBrowser(/Instagram/.test(navigator.userAgent));
  }, []);

  // Handle Instagram redirect completion
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('login_success');
    const error = params.get('login_error');

    if (success === 'true' && linkInfo?.destinationUrl) {
      window.location.href = linkInfo.destinationUrl;
    } else if (error) {
      setError('Google sign-in was cancelled or failed.');
    }
  }, [linkInfo]);

  // Fetch link destination and track visit
  useEffect(() => {
    let mounted = true;
    
    const fetchLinkAndTrackVisit = async () => {
      try {
        // First get the link info
        const res = await apiReq.get(`/api/links/${slug}`);
        if (!mounted) return;
        setLinkInfo(res.data);
        
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

  const handleGoogleLogin = () => {
    // if (isInstagramBrowser) {
    //   setLoading(true);
    //   setInstagramRedirectInitiated(true);
    //   // Use the same base URL as the current page
    //   const baseUrl = window.location.origin;
    //   // Open in new tab for Instagram browser
    //   window.open(
    //     `${baseUrl}/api/auth/google?slug=${slug}&redirect_uri=${encodeURIComponent(window.location.href)}`,
    //     '_blank'
    //   );
    //   // Add a message for users to return to the original tab
    //   setLoading(false);
    // } else {
    //   // Normal login flow
    //   login();
    // }
      login();
  };

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
      {linkInfo?.googleLogin && (
        <>
          {isInstagramBrowser && (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                For best results, please open this link in Chrome or Safari
              </Typography>
              {instagramRedirectInitiated && (
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  After signing in with Google, please return to this tab to continue
                </Typography>
              )}
            </>
          )}
          <Button 
            variant="contained" 
            onClick={handleGoogleLogin} 
            disabled={loading}
          >
            Continue with Google
          </Button>
        </>
      )}
      {loading && <Loader />}
    </Box>
  );
};

export default RedirectPage;