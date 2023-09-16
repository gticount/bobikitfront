import React, { useState, useEffect } from 'react';

import { FaComment, FaHeart, FaPaperPlane } from 'react-icons/fa';

import EmojiPicker from 'emoji-picker-react';

import {
  getTimeDifference,
  retrievedCookieValue,
  handleLiker,
} from './utilities';

import { ImageCircle } from './ImageCircle';
import { Link } from 'react-router-dom';
import PostComment from './postComments';
import { AudioPlayer } from './audioPlayer';
import Spinner from './Spinner';
import { handleCommenting } from './utilities';
import { useMyContext } from '../alertContext';

const jwtToken = retrievedCookieValue();

const PostOverlay = ({ post, clicked, showbutton, index, me }) => {
  const { showAlert } = useMyContext();
  const [like, setLike] = useState(
    post.likes.some((id) => id.toString() === me._id.toString()),
  );

  const earlyLike = post.likes.some(
    (id) => id.toString() === me._id.toString(),
  );
  const [currentAction, setCurrentAction] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [EmojiActive, setEmojiActive] = useState(false);
  const [sending, setSending] = useState(false);
  const [ReplyActive, setReplyActive] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [commentIndex, setCommentIndex] = useState(null);

  useEffect(() => {
    if (currentAction) {
      if (
        currentAction === 'increase' &&
        activeIndex < post.content.length - 1
      ) {
        setActiveIndex(activeIndex + 1);
      } else if (currentAction === 'decrease' && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
      window.history.replaceState(
        null,
        '',
        `/post/${post._id}/${activeIndex}/${clicked}/${showbutton}`,
      );
      setCurrentAction(null);
    }
  }, [currentAction]);

  const handleLike = () => {
    try {
      handleLiker({
        type: 'posts',
        id: post._id.toString(),
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

  const handleTextareaKeyDown = async (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      try {
        setSending(true);
        e.preventDefault();
        setInputValue('');
        const res = await handleCommenting({
          type: ReplyActive ? 'replies' : 'comments',
          comment: inputValue,
          posttoComment: ReplyActive ? commentId : post._id.toString(),
          me: me,
          jwtToken: jwtToken,
          showAlert: showAlert,
        });

        if (ReplyActive) {
          post.comments[commentIndex].replies.push(res.data.data.doc);
        } else post.comments.push(res.data.data.doc);
        setReplyActive(false);
        setSending(false);
      } catch (err) {
        showAlert({
          type: 'error',
          message: 'Couldnt post comment...',
        });
      }
    }
  };

  const handleEmojiSelect = (emoji) => {
    const emojiString = emoji.emoji;
    setInputValue((prevValue) => prevValue + emojiString);
  };

  const EmojiActiveHandler = () => {
    setEmojiActive(!EmojiActive);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="absolute xl:left-60 xl:right-60 md:left-10 md:right-10 bg-lightgray">
        <div className="grid grid-cols-2 w-[100%]">
          <div className="bg-gray-200 w-full h-full">
            {!currentAction ? (
              <AudioPlayer
                post={post}
                setCurrentAction={setCurrentAction}
                activeIndex={activeIndex}
                audioRef={React.createRef()}
                medium="post"
              />
            ) : (
              <Spinner />
            )}
          </div>
          <div className="bg-gray-100" style={{ overflow: 'none' }}>
            <div className="w-[100%] mx-[1px] flex flex-row my-4">
              <div className="flex items-start cursor-pointer pr-4 pl-2">
                <Link to={`/profile/${post.user.username}`}>
                  <ImageCircle
                    width={13}
                    height={13}
                    src={post.user.photo}
                    mb={0}
                    borderWidth={0}
                  />
                </Link>
              </div>
              <div className="flex cursor-pointer pt-1">
                <Link to={`/profile/${post.user.username}`}>
                  <p className="text-sm font-semibold text-gray-600">
                    {post.user.username}
                  </p>
                </Link>
              </div>
              <div className="flex-grow"></div> {/* Spacer */}
              <div className="flex pr-2 pt-1">
                <p className="text-xs text-gray-600">
                  {getTimeDifference(post.createdAt)}
                </p>
              </div>
            </div>
            <div
              className="w-[100%]"
              style={{
                borderBottom: '1px solid rgba(130,176,77,255)',
                opacity: 0.1,
              }}
            ></div>

            {post.caption && (
              <div className="w-[100%] mx-[0px] my-4 flex flex-row self-start">
                <div className="w-[12%] flex cursor-pointer pr-4 pl-2">
                  <Link to={`/profile/${post.user.username}`}>
                    <ImageCircle
                      width={13}
                      height={13}
                      src={post.user.photo}
                      mb={0}
                      borderWidth={0}
                    />
                  </Link>
                </div>
                <div className="w-[85%] flex">
                  <div className="flex-col">
                    <div className="flex">
                      <div className="flex cursor-pointer pt-1 pr-2">
                        <Link to={`/profile/${post.user.username}`}>
                          <p className="text-xs font-semibold text-gray-600">
                            {post.user.username}
                          </p>
                        </Link>
                      </div>
                      <div className="flex cursor-pointer pt-1">
                        <p className="text-xs font-normal text-gray-600">
                          {post.caption}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <p className="flex text-[10px] font-extralight text-gray-600">
                        {getTimeDifference(post.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="max-h-[430px] overflow-y-scroll">
              {post.comments &&
                Array.isArray(post.comments) && // Check if post.comments is defined and an array
                post.comments.map((comment, index) => (
                  <PostComment
                    setReplyActive={setReplyActive}
                    setCommentId={setCommentId}
                    key={index}
                    comment={comment}
                    index={index}
                    me={me}
                    setCommentIndex={setCommentIndex}
                  />
                ))}
            </div>

            <div className="w-[100%] mx-[0px] mt-1 pl-1">
              <div className="flex flex-row items-center p-1">
                <FaHeart
                  onClick={handleLike}
                  className={`font-normal hover:stroke-gray-600 stroke-gray-600  ${
                    like
                      ? 'fill-red-500 stroke-[1px]'
                      : 'fill-transparent stroke-[30px]'
                  } `}
                  size={20}
                />
                <div className="pl-2">
                  <FaComment
                    className="font-normal hover:text-gray-600 fill-transparent stroke-gray-600 stroke-[30px]"
                    size={20}
                  />
                </div>
                <div className="pl-2">
                  <FaPaperPlane
                    className="font-normal hover:text-gray-600 fill-transparent stroke-gray-600 stroke-[30px]"
                    size={20}
                  />
                </div>
              </div>
            </div>
            <div className="w-[100%] mx-[0px] my-0.5 pl-2">
              <div className="flex flex-row items-center">
                <p className="text-xs">
                  {' '}
                  {earlyLike
                    ? !like
                      ? post.likes.length - 1
                      : post.likes.length
                    : !like
                    ? post.likes.length
                    : post.likes.length + 1}
                </p>
                <p className="text-xs pl-2">likes</p>
              </div>
            </div>

            {EmojiActive && (
              <div className="fixed top-0 right-0 w-screen h-screen flex justify-center items-center">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}

            <div className="w-[100%] mx-[0px] my-0.5 pl-2 flex relative">
              {ReplyActive && (
                <div className="relative">
                  <select
                    className="border-b-[0.5px] border-gray-300 outline-none py-1 text-sm font-extralight"
                    onChange={(e) => {
                      if (e.target.value === 'comment') {
                        setReplyActive(false);
                        setCommentId(null);
                      }
                    }}
                  >
                    <option value="reply">Reply</option>
                    <option value="comment">Comment</option>
                  </select>
                </div>
              )}
              <textarea
                rows={1}
                type="text"
                className="w-full pl-2 border-b-[0.5px] border-gray-300 outline-none py-1 text-sm font-extralight placeholder-gray-500"
                placeholder={
                  sending ? 'Posting comment...' : 'Create a comment'
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => handleTextareaKeyDown(e)}
              />
              <p
                className="border-none cursor-pointer absolute right-2 text-xl"
                onClick={() => EmojiActiveHandler(EmojiActive)}
              >
                😀
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/*if (audioRef[activeIndex].current) {
                        audioRef[activeIndex].current.removeEventListener(
                          'ended',
                          () => audioRef[activeIndex].current.pause(),
                        );*/
export default PostOverlay;
