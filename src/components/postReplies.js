import React, { useState, useRef } from 'react';
import { FaHeart } from 'react-icons/fa';
import { ImageCircle } from './ImageCircle';
import { Link } from 'react-router-dom';
import {
  getTimeDifference,
  retrievedCookieValue,
  handleLiker,
  handleDeleting,
} from './utilities';

import { useMyContext } from '../alertContext';

const jwtToken = retrievedCookieValue();
const PostReplies = ({ reply, me }) => {
  const replyRef = useRef();
  const { showAlert } = useMyContext();
  const [like, setLike] = useState(reply.likes.some((id) => id === me._id));
  const earlyLike = reply.likes.some(
    (id) => id.toString() === me._id.toString(),
  );

  const handleLike = () => {
    try {
      handleLiker({
        type: 'commentOrReply/reply',
        id: reply._id.toString(),
        jwtToken: jwtToken,
      })
        .then((res) => {
          setLike(!like);
          showAlert({
            type: 'success',
            message: 'updated like...',
          });
        })
        .catch((err) => {
          showAlert({
            type: 'error',
            message: 'Couldnt update like...',
          });
        });
    } catch (err) {
      showAlert({
        type: 'error',
        message: 'Couldnt update like...',
      });
    }
  };

  return (
    <div ref={replyRef} className="flex flex-col my-4">
      <div className="flex cursor-pointer pr-4 pl-2">
        <Link to={`/profile/${reply.user.username}`}>
          <ImageCircle
            width={8}
            height={8}
            src={reply.user.photo}
            mb={0}
            borderWidth={0}
          />
        </Link>
      </div>
      <div className="flex">
        <div className="flex-col">
          <div className="flex mb-2">
            <div className="flex cursor-pointer pt-1 pr-2">
              <Link to={`/profile/${reply.user.username}`}>
                <p className="text-[11px] font-semibold text-gray-500">
                  {reply.user.username}
                </p>
              </Link>
            </div>
            <div className="flex cursor-pointer pt-1">
              <p className="text-[11px] font-normal text-gray-500">
                {reply.content}
              </p>
            </div>
          </div>
          <div className="flex">
            <p className="flex text-[10px] font-extralight text-gray-500">
              {getTimeDifference(reply.createdAt)}
            </p>
            <p className="flex text-[10px] font-extralight text-gray-500 pl-4">
              {earlyLike
                ? !like
                  ? reply.likes.length - 1
                  : reply.likes.length
                : !like
                ? reply.likes.length
                : reply.likes.length + 1}{' '}
              {reply.likes.length > 1 ? 'likes' : 'like'}
            </p>

            {reply.user._id.toString() === me._id.toString() && (
              <p
                className="flex text-[10px] font-extralight text-gray500 pl-2 cursor-pointer"
                onClick={async () => {
                  try {
                    const res = await handleDeleting({
                      type: 'commentOrReply/reply',
                      id: reply._id.toString(),
                      jwtToken: jwtToken,
                      showAlert: showAlert,
                    });
                    replyRef.current.style.display = 'none';
                  } catch (err) {
                    showAlert({
                      type: 'error',
                      message: 'couldnt delete...',
                    });
                  }
                }}
              >
                {' '}
                Delete
              </p>
            )}
          </div>
        </div>
        <div className="flex-grow"></div>
        <div className="flex pt-1">
          <FaHeart
            onClick={handleLike}
            className={`font-normal hover:stroke-gray-600 stroke-gray-600  ${
              like
                ? 'fill-red-500 stroke-[1px]'
                : 'fill-transparent stroke-[30px]'
            } `}
            size={12}
          />
        </div>
      </div>
    </div>
  );
};

export default PostReplies;
