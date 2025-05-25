import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import apiReq from '../../../utils/axiosReq';
import { Box } from '@mui/material';
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

  // const handlesave = async (credentialResponse) => {
  //   try {
  //     setLoading(true);
  //     const email = "test@mail.com";
  //     console.log(email);
  //     if (!email) {
  //       throw new Error('Email not found in decoded token');
  //     }

  //     await apiReq.post(`/api/visits/${slug}`, { email });

  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      if (!email) {
        throw new Error('Email not found in decoded token');
      }

      await apiReq.post(`/api/visits/${slug}`, { email });

      // Redirect
      window.location.href = linkInfo.destinationUrl;
    } catch (err) {
      setError('Something went wrong while logging in or redirecting.');
      setLoading(false);
    }
  };

  const handleLoginError = () => {
    setError('Google sign-in was cancelled or failed.');
  };

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
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <h2>Please sign in to continue</h2>
      {/* <button onClick={handlesave}>Click me</button> */}
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        useOneTap
        auto_select
      />
      {loading && <Loader />}
    </Box>
  );
};

export default RedirectPage;
