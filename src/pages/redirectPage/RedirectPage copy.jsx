import { useParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import apiReq from '../../../utils/axiosReq';
import { useEffect, useState } from 'react';

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

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

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

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  if (!linkInfo) return <div>Loading link data...</div>;

  if (loading) return <div>Logging in... Redirecting...</div>;

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h3>Continue to view the page</h3>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
    </div>
  );
};

export default RedirectPage;
