import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';

const githubAuthorizeUrl = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}`;

function App() {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const githubLoginCode = urlParams.get('code');
    // console.log(githubLoginCode);

    // if (githubLoginCode && localStorage.getItem('user') === null) {
    if (githubLoginCode) {
      const getAccessToken = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_ENDPOINT}/getAccessToken?githublogincode=${githubLoginCode}`
          );
          const { access_token } = response.data;
          getUserDetails(access_token);
        } catch (error) {
          console.error('Error fetching access token:', error);
        }
      }

      const getUserDetails = async (access_token) => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_ENDPOINT}/getUserDetails`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      getAccessToken();
    }
  }, [])

  const handleGithubLogin = () => {
    window.location.assign(githubAuthorizeUrl);
  }

  return (
    <div className='bg-[#151515] h-screen w-full text-white flex flex-col justify-start items-center'>
      <button onClick={handleGithubLogin}
        className='bg-red-700 px-7 py-4 my-10 rounded-md hover:bg-red-800 transition-colors duration-500 hover:scale-110'
      >Login
      </button>
    </div>
  )
}

export default App
