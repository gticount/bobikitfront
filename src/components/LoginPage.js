// LoginPage.js
import React, { useState } from 'react';
import './LoginPage.css';
import axios from 'axios';
import { firebaseAuth } from '../firebase-config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { handleLogin } from './utilities';
import { useMyContext } from '../alertContext';

const LoginPage = () => {
  const { showAlert } = useMyContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      // `result.user` will contain user info after successful Google login
      handleLogin({
        body: {
          email: result.user.email,
          accessToken: result.user.accessToken,
        },
        showAlert,
      });
      // You can now authenticate this user in your backend or store their details in state, etc.
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      // `result.user` will contain user info after successful Google login
      if (result.user.emailVerified) {
        handleLogin({
          body: {
            email: result.user.email,
            accessToken: result.user.accessToken,
            photo: `${result.user.photoURL}`,
            smallPhoto: `${result.user.photoURL}`,
            largePhoto: `${result.user.photoURL}`,
            profile: true,
            name: result.user.displayName,
            role: 'user',
            active: true,
            passwordChangedAt: Date.now(),
            status: 'Hey i am using Bobikit',
            username: result.user.email.split('@')[0],
            password: 'yepasswordskipkarnekeliyehai',
            passwordConfirm: 'yepasswordskipkarnekeliyehai',
          },
          url: 'https://bobikit.onrender.com/api/v1/users/signup',
          showAlert,
        });
      }
      // You can now authenticate this user in your backend or store their details in state, etc.
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-image">
          <img
            src="https://www.dropbox.com/scl/fi/ds1g92nrplhtd1p9azsex/Bobikit-removebg-preview.png?rlkey=rmu9pyyrdqdf565nsb6dirs99&raw=1"
            alt="Login"
            className="login-image"
          />
        </div>
        <div className="login-form">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="mb-2"
            onClick={() => handleLogin({ username, password })}
          >
            Login
          </button>

          <div className="flex flex-row">
            <div
              onClick={handleGoogleLogin}
              className="w-60 h-12 cursor-pointer mr-4 bg-blue-500 rounded-lg shadow-md hover:shadow-lg transition duration-300 active:bg-blue-600 flex items-center "
            >
              <p className="pl-2"></p>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <img
                  className="w-6 h-6"
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  alt="Google Icon"
                />
              </div>
              <p className="ml-2 text-white text-sm font-medium">
                <b>Sign in</b>
              </p>
            </div>

            <div
              onClick={handleGoogleSignUp}
              className="w-60 h-12 cursor-pointer bg-blue-500 rounded-lg shadow-md hover:shadow-lg transition duration-300 active:bg-blue-600 flex items-center"
            >
              <p className="pl-2"></p>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <img
                  className="w-6 h-6"
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  alt="Google Icon"
                />
              </div>
              <p className="ml-2 text-white text-sm font-medium">
                <b>Sign up</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
