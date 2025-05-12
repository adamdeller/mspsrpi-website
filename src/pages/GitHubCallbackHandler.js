import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Authloading from './Authloading'; // Import the loading component

const GitHubCallbackHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateWithGitHub = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (!code) {
        console.error('GitHub OAuth code not found in URL');
        return;
      }

      try {
        // 🔁 Exchange the code with your backend for the access token and GitHub user info
        const response = await fetch('https://mspsrpi-auth.onrender.com/github-auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code })
        });

        const result = await response.json();

        if (response.ok && result?.user?.login) {
          // ✅ Replace with actual logic to check allowed usernames
          const allowedUsers = ['kavindu12', 'codexnyctis']; // example usernames

          if (allowedUsers.includes(result.user.login)) {
            localStorage.setItem('authenticated', 'true');
            localStorage.setItem('githubUser', result.user.login);
            navigate('/restricted-area');
          } else {
            alert('Access denied: Unauthorized GitHub user.');
            localStorage.removeItem('authenticated');
            navigate('/');
          }
        } else {
          console.error('Failed to authenticate:', result);
        }
      } catch (error) {
        console.error('OAuth error:', error);
      }
    };

    authenticateWithGitHub();
  }, [navigate]);

  // Return the Authloading component instead of the simple text
  return <Authloading />;
};

export default GitHubCallbackHandler;