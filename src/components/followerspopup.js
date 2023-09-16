import React, { useEffect, useState } from 'react';
import { ImageCircle } from './ImageCircle';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { retrievedCookieValue } from './utilities';
import { useMyContext } from '../alertContext';

import { FollowButton } from './followButton';

export function FollowersPopup({
  which,
  user,
  jwtToken,
  onClose,
  setPopupActivated,
  setData,
}) {
  const [list, setList] = useState([]);
  const { showAlert } = useMyContext();

  useEffect(() => {
    if (!setData) {
      axios
        .get(`https://bobikit.onrender.com/api/v1/users/${which}/${user}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          setList(res.data.data.doc);
        })
        .catch((err) => {
          showAlert({
            type: 'error',
            message: 'couldnt retrieve list',
          });
        });
    } else {
      setList(setData);
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-30">
      <div className="bg-black opacity-50 w-full h-full fixed top-0 left-0"></div>
      <div className="w-[25rem] z-50 h-[25rem] bg-white p-4 rounded-lg overflow-y-scroll">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => setPopupActivated(false)}
        >
          Close
        </button>
        <div>
          {setData
            ? 'Vieweres'
            : which === 'findFollowers'
            ? 'Followers'
            : 'Following'}
        </div>
        {list.map((slide, itndex) => (
          <Link key={`story-${itndex}`} to={`/profile/${slide.username}`}>
            <div key={`story-${itndex}`} className="flex-row pt-8">
              <div className="ml-1 flex">
                <ImageCircle
                  width={15}
                  height={15}
                  src={slide.largePhoto}
                  mb={0}
                  circleColor="rgba(153, 153, 255,0.5)"
                  borderWidth={0}
                  className="w-[18%]"
                />
                <div className="w-[60%] flex-col pl-2 pt-3">
                  <p className="text-xs text-gray-900 mb-1">{slide.name}</p>
                  <div className="text-xs text-gray-400 font-serif font-extralight flex flex-row">
                    <p className="text-xs text-gray-400 font-serif font-extralight"></p>
                  </div>
                </div>
                {!setData && (
                  <FollowButton
                    isFriend={slide.isFriend}
                    suggestion={slide._id}
                    jwtToken={jwtToken}
                    showAlert={showAlert}
                  />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
