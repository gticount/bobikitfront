import React, { useState, useEffect, useRef } from 'react';
import { sendMessage } from './utilities';

export function FollowButton({
  isFriend,
  suggestion,
  jwtToken,
  showAlert,
  ismuted,
  mutebutton,
  otherUserProfile,
  otheruser,
}) {
  const [followStatus, setfollowStatus] = useState(isFriend);
  const [mute, setMute] = useState(ismuted);
  const handleFollow = async () => {
    if (mutebutton) {
      if (!mute) {
        const newmute = [...otherUserProfile.mute, otheruser._id];
        const res = await sendMessage({
          url: `https://bobikit.onrender.com/api/v1/users/mute`,
          requestBody: {
            mute: newmute,
          },
          jwtToken: jwtToken,
          showAlert: showAlert,
          mutei: true,
        });
      } else {
        const newmute = otherUserProfile.mute.filter(
          (doci) => doci._id.toString() !== otheruser._id.toString(),
        );
        const res = await sendMessage({
          url: `https://bobikit.onrender.com/api/v1/users/mute`,
          requestBody: {
            mute: newmute,
          },
          jwtToken: jwtToken,
          showAlert: showAlert,
          mutei: true,
        });
      }
      setMute((mutei) => !mutei);
    } else {
      if (!followStatus) {
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
      } else {
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
      }
    }
  };
  return (
    <button
      onClick={handleFollow}
      className={` px-2 h-8 w-16 ${
        mutebutton
          ? 'bg-gray-300'
          : followStatus
          ? 'bg-gray-300'
          : 'hover:bg-[rgba(255,102,196,0.8)] bg-[rgba(255,102,196,1)]'
      } border-0 rounded-[8px] focus:outline-none  focus:ring-opacity-0 text-xs font-medium`}
    >
      {mutebutton
        ? mute
          ? 'Unmute'
          : 'Mute'
        : followStatus
        ? 'following'
        : 'follow'}
    </button>
  );
}
