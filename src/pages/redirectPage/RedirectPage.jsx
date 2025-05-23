import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RedirectPage = () => {
  const { slug } = useParams();

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        const { credential } = response;
        const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`);
        const email = userInfo.data.email;

        const linkRes = await axios.get(`/api/links/${slug}`);
        await axios.post(`/api/visits/${slug}`, { email });

        window.location.href = linkRes.data.destinationUrl;
      },
    });

    window.google.accounts.id.prompt();
  }, [slug]);

  return <div>Redirecting... Please wait</div>;
};

export default RedirectPage;
