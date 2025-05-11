// // src/components/GitHubLoginButton.js
// import React from 'react';

// const GITHUB_CLIENT_ID = "Ov23li2yHgvSuWJdNDmB";
// const REDIRECT_URI = "http://localhost:3000/mspsrpi-website#/github-callback";

// const GitHubLoginButton = () => {
//   const handleLogin = () => {
//     const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=read:user`;
//     window.location.href = githubAuthUrl;
//   };

//   return (
//     <div className="flex justify-center mt-12">
//       <button
//         onClick={handleLogin}
//         className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300"
//       >
//         Sign in with GitHub
//       </button>
//     </div>
//   );
// };

// export default GitHubLoginButton;

import React from 'react';

const GitHubLoginButton = () => {
  const clientId = 'Ov23li2yHgvSuWJdNDmB'; // Replace with your GitHub OAuth App client ID
  //For Local Testing

  // const redirectUri = 'http://localhost:3000/mspsrpi-website#/github-callback';

  // For Prod Env
  const redirectUri = 'https://codexnyctis.github.io/test-deploy/#/github-callback';

  const handleLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`;
    window.location.href = githubAuthUrl;
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
    >
      Sign in with GitHub
    </button>
  );
};

export default GitHubLoginButton;
