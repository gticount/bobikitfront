import React, { useState, useRef } from 'react';
import axios from 'axios';
import { retrievedCookieValue } from './components/utilities';
import { useParams, useNavigate } from 'react-router-dom';
import { useMyContext } from './alertContext';

const UserProfileSettings = ({ me }) => {
  // State variables for user profile settings
  const [profilePic, setProfilePic] = useState(me.photo);
  const { showAlert } = useMyContext();
  const [username, setUsername] = useState(me.username);
  const [bio, setBio] = useState(me.status);
  const [name, setName] = useState(me.name);
  const [email, setEmail] = useState(me.email);
  const [phoneNumber, setPhoneNumber] = useState(me.phoneNumber);
  const [isPublic, setIsPublic] = useState(me.profile);
  const fileInputRef = useRef();
  const jwtToken = retrievedCookieValue();
  const navigate = useNavigate();

  // Function to handle form submission
  const handlePhotoUpload = async (e) => {
    const formDataImage = new FormData();
    formDataImage.append(`image`, e.target.files[0]);
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'multipart/form-data',
    };
    axios
      .post(
        `https://bobikit.onrender.com/api/v1/users/createProfileUpload/`,
        formDataImage,
        {
          headers,
        },
      )
      .then((res) => {
        if (res.status === 200) {
          showAlert({
            type: 'success',
            message: 'settings updated',
          });
          navigate('/');
        }
      });
  };
  const handleSubmit = async (e) => {
    let data = {
      username,
      status: bio,
      name,
      email,
      phoneNumber,
      profile: isPublic,
    };
    if (e === 'delete') {
      data = {
        active: false,
      };
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`, // Include the bearer token in the headers
    };
    // Implement logic to update user profile settings here
    axios
      .patch('https://bobikit.onrender.com/api/v1/users/me', data, {
        headers,
      })
      .then((res) => {
        if ((res.status = 200)) {
          navigate('/');
        }
      });
  };

  return (
    <div className=" min-h-screen py-10">
      <div className="max-w-xl mx-auto bg-gray-100 p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Profile Settings
        </h1>

        {/* Profile Picture */}
        <div className="mb-4 flex flex-row">
          <img
            src={profilePic}
            className="rounded-full w-[40px] h-[40px]"
            alt="current profile pic"
          />
          <input
            type="file"
            className="w-full p-2 border rounded-md hidden"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => {
              handlePhotoUpload(e);
            }}
          />
          <p
            className="text-blue-500 pt-2 pl-8 cursor-pointer hover:underline"
            onClick={() => {
              fileInputRef.current.click();
            }}
          >
            Change Profile Picture
          </p>
        </div>

        {/* Username */}
        <div className="mb-6 flex flex-row">
          <label className="block text-sm text-gray-500 font-semibold mb-2 pr-8">
            Username
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div className="mb-6 flex flex-row">
          <label className="block text-sm text-gray-500 font-semibold mb-2 pr-20">
            Bio
          </label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows="4"
            placeholder="Write a short bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>

        {/* Name */}
        <div className="mb-6 flex flex-row">
          <label className="block text-sm text-gray-500 font-semibold mb-2 pr-16">
            Name
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-6 flex flex-row">
          <label className="block text-sm text-gray-500 font-semibold mb-2 pr-16">
            Email
          </label>
          <input
            type="email"
            className="w-full p-2 border rounded-md"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone Number */}
        <div className="mb-6 flex flex-row">
          <label className="block text-sm text-gray-500 font-semibold mb-2 pr-10">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full p-2 border rounded-md"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Privacy Settings */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Privacy Settings</label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
            />
            <span className="text-sm">Make my profile public</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full bg-[rgba(130,176,77,255)] text-white py-2 rounded-md hover:bg-[rgba(58,98,14,1)]"
        >
          Save Settings
        </button>
        <div className="pt-2"></div>

        <p
          className="w-[120px] cursor-pointer text-xs font-bold rounded-xl text-center bg-red-500 text-white py-2  hover:bg-red-700"
          onClick={() => {
            handleSubmit('delete');
          }}
        >
          Delete Account
        </p>
      </div>
    </div>
  );
};

export default UserProfileSettings;
