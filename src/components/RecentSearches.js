import React from 'react';
import { ImageCircle } from './ImageCircle';
import { Link } from 'react-router-dom';
import { getTimeDifference, retrievedCookieValue } from './utilities';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { useMyContext } from '../alertContext';

const jwtToken = retrievedCookieValue();

export function RecentSearches({ users, index, me, pata }) {
  const { showAlert } = useMyContext();
  const updateRecentSearch = async (toadd, user) => {
    try {
      const res = await axios.get(
        `https://bobikit.onrender.com/api/v1/users/updatRecentSearch/${toadd}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );
    } catch (err) {
      showAlert({
        type: 'error',
        message: 'couldnt update search',
      });
    }
  };
  return (
    <div className="flex pt-8 flex-col mb-8">
      {users.map((slide, itndex) => (
        <Link
          to={`/profile/${slide.username}`}
          onClick={() => updateRecentSearch(slide._id, me._id.toString())}
        >
          <div key={`story-${itndex}`} className="flex-row pt-8">
            <div className="ml-1 flex">
              <ImageCircle
                width={17}
                height={17}
                src={slide.photo}
                mb={0}
                circleColor="rgba(153, 153, 255,0.5)"
                borderWidth={0}
                className="w-[18%]"
              />
              <div className="w-[80%] flex-col pl-4 pt-3">
                <p className="text-xs text-gray-900 mb-1">{slide.username}</p>
                <div className="text-xs text-gray-400 font-serif font-extralight flex flex-row">
                  <p className="text-xs text-gray-400 font-serif font-extralight">
                    {slide.name}
                  </p>
                  <p className="flex-grow"></p>
                  <p className="text-[10px]">
                    {index === 'recent' ? <AiOutlineClose /> : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
