import React, { useState } from 'react';
import { ImageCircle } from './ImageCircle';
import Stories from './Stories';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { FollowersPopup } from './followerspopup';
import {
  retrievedCookieValue,
  createMessage,
  findCommonElement,
  handleDeleting,
} from './utilities';
import { useMyContext } from '../alertContext';
import { FollowButton } from './followButton';

const chunkArray = (array, chunkSize) => {
  return array.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
};

const jwtToken = retrievedCookieValue();

export function Profile({
  sizes,
  me,
  posts,
  story,
  myprofile,
  otherUserProfile,
}) {
  const { showAlert } = useMyContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const createmessages = async () => {
    const commonElements = findCommonElement(
      me.conversations,
      otherUserProfile.conversations,
    );
    if (commonElements.length === 0) {
      try {
        const res = await createMessage({
          firstuser: otherUserProfile._id,
          seconduser: me._id,
          jwtToken: jwtToken,
          showAlert: showAlert,
        });
        navigate(`/message/${res.doc._id}`);
      } catch (err) {
        showAlert({
          type: 'error',
          message: 'couldnt create conversation...',
        });
      }
    } else {
      navigate(`/message/${commonElements[0]}`);
    }
  };

  const [popupactivated, setPopupActivated] = useState(false);
  const [findWhich, setFindWhich] = useState(null);
  const chunks = chunkArray(posts, 3);
  const loadfollowers = (e) => {
    setPopupActivated(true);
    setFindWhich(e);
  };

  return (
    <div className="w-[1000px] h-screen flex">
      {popupactivated && (
        <div className="z-50">
          <FollowersPopup
            which={findWhich}
            user={me._id.toString()}
            jwtToken={jwtToken}
            setPopupActivated={setPopupActivated}
          />
        </div>
      )}
      <div className="flex-col">
        <div className="flex flex-row items-start align-top">
          <ImageCircle
            width={sizes}
            height={sizes}
            src={me.largePhoto}
            mb={0}
            circleColor="rgba(153, 153, 255,0.5)"
            borderWidth={0}
          />

          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <p className="align-top pl-16 py-1 font-sans subpixel-antialiased text-lg text-gray-800 font-normal">
                {me.username}
              </p>
              <div className="pl-4 py-4">
                {myprofile && (
                  <Link to={'/settings'}>
                    <button
                      className={`p-2 pl-4 pr-4 hover:bg-gray-300 bg-gray-200 border-0 rounded-[8px] focus:outline-none  focus:ring-opacity-0 text-xs font-medium`}
                    >
                      Edit profile
                    </button>
                  </Link>
                )}

                {!myprofile && (
                  <FollowButton
                    isFriend={me.followStatus}
                    suggestion={me._id}
                    jwtToken={jwtToken}
                    showAlert={showAlert}
                  />
                )}

                {!myprofile && (
                  <FollowButton
                    isFriend={me.followStatus}
                    ismuted={otherUserProfile.mute.includes(me._id)}
                    suggestion={me._id}
                    jwtToken={jwtToken}
                    showAlert={showAlert}
                    mutebutton={true}
                    otherUserProfile={otherUserProfile}
                    otheruser={me}
                  />
                )}
              </div>

              <div className="pl-4 py-4">
                {!myprofile && (
                  <button
                    onClick={createmessages}
                    className={`p-2 pl-4 pr-4 hover:bg-gray-300 bg-gray-200 border-0 rounded-[8px] focus:outline-none  focus:ring-opacity-0 text-xs font-medium`}
                  >
                    Message
                  </button>
                )}
              </div>
            </div>
            <div className="flex-row flex pl-16 py-1">
              <p className="text-xs font-medium">{posts.length} posts</p>
              <p
                onClick={() => loadfollowers('findFollowers')}
                className="text-xs font-medium pl-8 cursor-pointer"
              >
                {me.followers} followers
              </p>
              <p
                onClick={() => loadfollowers('findFollowing')}
                className="text-xs font-medium pl-8 cursor-pointer"
              >
                {me.following} following
              </p>
            </div>

            <div className="flex-row flex pl-16 pt-2">
              <p className="text-sm font-sans subpixel-antialiased text-gray-700 font-medium">
                {me.name}{' '}
              </p>
            </div>

            <div className="flex-row flex pl-16 pt-1">
              <p className="text-sm font-sans subpixel-antialiased text-gray-700 font-normal">
                {me.status}{' '}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-16">
          {story && (
            <Stories slides={story} sizes={30} limit={8} highlights={true} />
          )}
        </div>
        <div className="border-b-2 border-gray-300 mt-16 mb-1"></div>

        <div className="flex flex-wrap flex-col">
          {chunks.map((el, index) => (
            <div
              key={index + `${el}`}
              className="w-full px-0.5 relative flex flex-row"
            >
              {el.map((element, dindex) => (
                <Link to={`/post/${element._id}/${0}/${true}/${false}`}>
                  <div className="p-0.5 relative" key={index * dindex + dindex}>
                    <img
                      src={element.content}
                      alt="img"
                      className="w-1/3 h-full object-cover"
                      style={{ width: `${100 * 3}px`, height: `${100 * 3}px` }}
                    />
                    <div className="absolute inset-0 flex hover:bg-[rgba(130,176,77,0.1)] hover:bg-opacity-20 items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out">
                      <FaRegHeart className="text-gray-600" size={20} />
                      <p className="text-[rgba(255,102,196,1)] text-lg font-bold pr-4">
                        {element.likes.length}
                      </p>

                      <FaRegComment className="text-gray-600" size={20} />
                      <p className="text-[rgba(255,102,196,1)] text-lg font-bold">
                        {element.comments.length}
                      </p>

                      {!id && (
                        <div
                          onClick={(event) => {
                            event.preventDefault();
                            handleDeleting({
                              type: 'posts',
                              id: element._id.toString(),
                              jwtToken,
                              showAlert,
                            });
                          }}
                          className="pl-4"
                        >
                          <AiFillDelete className="text-gray-600" size={20} />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* hello */}
      </div>
    </div>
  );
}
