import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { sendMessage } from './utilities';

export function FollowSideComponent({ suggestion, jwtToken, showAlert }) {
  const [followStatus, setfollowStatus] = useState(false);
  const handleFollow = async () => {
    if (!followStatus) {
      try {
        const res = await sendMessage({
          url: `https://bobikit.onrender.com/api/v1/users/follow`,
          requestBody: {
            user: suggestion,
            follow: true,
          },
          jwtToken: jwtToken,
          showAlert: showAlert,
          follow: true,
        });
        setfollowStatus(true);
      } catch (err) {
        showAlert({
          type: 'error',
          message: 'Couldnt follow try again...',
        });
      }
    } else {
      try {
        const res = await sendMessage({
          url: `https://bobikit.onrender.com/api/v1/users/follow`,
          requestBody: {
            user: suggestion,
            follow: false,
          },
          jwtToken: jwtToken,
          showAlert: showAlert,
          follow: true,
        });
        setfollowStatus(false);
      } catch (err) {
        showAlert({
          type: 'error',
          message: 'Couldnt unfollow try again...',
        });
      }
    }
  };
  return (
    <div onClick={handleFollow} className="flex-grow text-right">
      <p className="text-xs font-semibold text-gray-600">
        {!followStatus ? 'follow' : 'following'}
      </p>
    </div>
  );
}
