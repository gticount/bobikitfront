import React, { useState, useEffect, useRef } from 'react';

import { FaHeart } from 'react-icons/fa';

import { ImageCircle } from './ImageCircle';
import { Link } from 'react-router-dom';
import PostReplies from './postReplies';
import {
  getTimeDifference,
  retrievedCookieValue,
  handleLiker,
  handleDeleting,
} from './utilities';

import { useMyContext } from '../alertContext';

const jwtToken = retrievedCookieValue();

const PostComment = ({
  comment,
  index,
  me,
  setCommentId,
  setReplyActive,
  setCommentIndex,
}) => {
  const { showAlert } = useMyContext();
  const [like, setLike] = useState(comment.likes.some((id) => id === me._id));
  const commentRef = useRef();

  const earlyLike = comment.likes.some(
    (id) => id.toString() === me._id.toString(),
  );
  const [postReplies, setPostReplies] = useState(false);

  const handleLike = () => {
    try {
      handleLiker({
        type: 'commentOrReply/comment',
        id: comment._id.toString(),
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
    <div
      ref={commentRef}
      className="w-[100%] mx-[0px] my-4 flex flex-row self-start"
    >
      <div className="w-[12%] flex cursor-pointer pr-4 pl-2">
        <Link to={`/profile/${comment.user.username}`}>
          <ImageCircle
            width={13}
            height={13}
            src={comment.user.photo}
            mb={0}
            borderWidth={0}
          />
        </Link>
      </div>
      <div className="w-[82%] flex">
        <div className="flex-col">
          <div className="flex mb-2">
            <div className="flex cursor-pointer pt-1 pr-2">
              <Link to={`/profile/${comment.user.username}`}>
                <p className="text-xs font-semibold text-gray500">
                  {comment.user.username}
                </p>
              </Link>
            </div>
            <div className="flex cursor-pointer pt-1">
              <p className="text-xs font-normal text-gray500">
                {comment.content}
              </p>
            </div>
          </div>
          <div className="flex">
            <p className="flex text-[10px] font-extralight text-gray500">
              {getTimeDifference(comment.createdAt)}
            </p>
            <p className="flex text-[10px] font-extralight text-gray500 pl-4">
              {earlyLike
                ? !like
                  ? comment.likes.length - 1
                  : comment.likes.length
                : !like
                ? comment.likes.length
                : comment.likes.length + 1}{' '}
              {comment.likes.length > 1 ? 'likes' : 'like'}
            </p>

            <p
              onClick={() => {
                setReplyActive(true);
                setCommentId(comment._id.toString());
                setCommentIndex(index);
              }}
              className="flex text-[10px] font-extralight text-gray500 pl-4 cursor-pointer"
            >
              Reply
            </p>

            {comment.user._id.toString() === me._id.toString() && (
              <p
                className="flex text-[10px] font-extralight text-gray500 pl-2 cursor-pointer"
                onClick={async () => {
                  try {
                    const res = await handleDeleting({
                      type: 'commentOrReply/comment',
                      id: comment._id.toString(),
                      jwtToken: jwtToken,
                      showAlert: showAlert,
                    });
                    commentRef.current.style.display = 'none';
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
          <div className="flex pt-4">
            <div className="flex-col">
              {comment.replies && (
                <p
                  onClick={() => setPostReplies(!postReplies)}
                  className="pl-8 text-[12px] font-extralight text-gray500 cursor-pointer"
                >
                  ______ {postReplies ? 'hide' : 'show'} replies (
                  {comment.replies.length})
                </p>
              )}
              {postReplies &&
                comment.replies.map((reply, index) => (
                  <div className="flex-col mb-4" key={index}>
                    <PostReplies key={index} reply={reply} me={me} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow"></div>
      <div className="w-[4%] flex pt-1">
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
  );
};

export default PostComment;
