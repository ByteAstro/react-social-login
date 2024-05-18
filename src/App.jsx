import { useEffect, useRef, useState } from 'react';
import './App.css'
import axios from 'axios';

// http://localhost:5173/oauth-callbak?code=c5879aab6a7cb10ff3c1

const githubAuthorizeUrl = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUBLOGIN_CLIENTID}`

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const githubLoginCode = urlParams.get('code');
    console.log(githubLoginCode);

    // if (githubLoginCode && localStorage.getItem('user') === null) {
    if (githubLoginCode) {
      const getAccessToken = async () => {
        await axios.get(
          `${import.meta.env.VITE_BACKEND_ENDPOINT}/getAccessToken?githublogincode=${githubLoginCode}`
        ).then((data) => {
          console.log(data);
          if (data.access_token) {
            setAccessToken(data.access_token);
            getUserDetails(data.access_token);
          }
        }).catch(err => {
          console.log('Error fetching access token:', err);
        })
      }
      getAccessToken();
    }
  }, [])

  useEffect(() => {
    console.log('AccessToken updated:', accessToken);
  }, [accessToken])

  const getUserDetails = async (access_token) => {
    console.log('getUserDetails called');
    await axios({
      method: 'GET',
      url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/getUserDetails`,
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }).then((data) => {
      console.log(data);
    }).catch(err => {
      console.log(err);
    });
  }

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
