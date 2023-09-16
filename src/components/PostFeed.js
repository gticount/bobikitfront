import React, { useState, useEffect } from 'react';

import { FaComment, FaHeart, FaPaperPlane } from 'react-icons/fa';
import { AudioPlayer } from './audioPlayer';
import Spinner from './Spinner';

import { ImageCircle } from './ImageCircle';
import { Link } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import {
  getTimeDifference,
  handleLiker,
  retrievedCookieValue,
  handleCommenting,
} from './utilities';

import { useMyContext } from '../alertContext';
const jwtToken = retrievedCookieValue();

const PostFeed = ({ post, me }) => {
  const { showAlert } = useMyContext();
  const [like, setLike] = useState(
    post.likes.some((id) => id.toString() === me._id.toString()),
  );
  const earlyLike = post.likes.some(
    (id) => id.toString() === me._id.toString(),
  );
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [more, setMore] = useState('more');
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [EmojiActive, setEmojiActive] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (currentAction) {
      if (currentAction === 'increase' && activeIndex < post.content.length - 1)
        setActiveIndex(activeIndex + 1);
      else if (currentAction === 'decrease' && activeIndex > 0)
        setActiveIndex(activeIndex - 1);
      setCurrentAction(null);
    }
  }, [currentAction]);

  const handleTextareaKeyDown = async (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      setSending(true);
      e.preventDefault();
      setInputValue('');
      try {
        const res = await handleCommenting({
          type: 'comments',
          comment: inputValue,
          posttoComment: post._id.toString(),
          me: me,
          jwtToken: jwtToken,
          showAlert: showAlert,
        });
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

  useEffect(() => {
    if (EmojiActive) {
      document.body.style.overflow = 'hidden'; // Enable scrolling
    } else {
      document.body.style.overflow = 'auto'; // Disable scrolling
    }
  }, [EmojiActive]);

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

  const handleCaptionToggle = () => {
    setShowFullCaption(!showFullCaption);
    if (more === 'more') setMore('view less');
    else setMore('more');
  };

  return (
    <div className="w-[100%] h-[750px] flex items-center flex-col overflow-hidden whitespace-nowrap mb-8">
      <div className="w-[100%] h-[20px] mx-[0px] my-[0px] flex flex-row">
        <div className="flex items-start cursor-pointer pr-4 pl-2">
          <Link to={`/profile/${post.user.username}`}>
            <ImageCircle
              width={13}
              height={13}
              src={post.user.smallPhoto}
              mb={0}
              borderWidth={0}
            />
          </Link>
        </div>
        <div className="flex cursor-pointer pt-2">
          <Link to={`profile/${post.user.username}`}>
            <p className="text-xs text-gray-600">{post.user.username}</p>
          </Link>
        </div>
        <div className="flex-grow text-right pr-2 pt-2">
          <p className="text-xs text-gray-600">
            {getTimeDifference(post.createdAt)}
          </p>
        </div>
      </div>
      <div className="pb-[28px]"></div>

      <div className="relative w-full min-h-[500px] max-h-[750px] bg-gray-100 rounded-3xl inline-block">
        {!currentAction ? (
          <AudioPlayer
            post={post}
            setCurrentAction={setCurrentAction}
            activeIndex={activeIndex}
            audioRef={React.createRef()}
            medium={'feed'}
          />
        ) : (
          <Spinner />
        )}
      </div>
      {EmojiActive && (
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </div>
      )}

      <div className="w-[100%] mx-[0px] pt-1 pl-1">
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
      <div className="w-[100%] mx-[0px] my-0.5 pl-2">
        <div className="flex items-center">
          <Link to={`/profile/${post.user.username}`}>
            <p className="text-sm font-medium">{post.user.username}</p>
          </Link>
          <p className="text-sm tracking-tight font-thin overflow-hidden whitespace-nowrap text-overflow-ellipsis pl-2">
            {post.caption
              .split(' ')
              .slice(0, 7)
              .reduce((result, word) => {
                if (result.length + word.length + 1 <= 50) {
                  result.push(word);
                }
                return result;
              }, [])
              .join(' ')}
          </p>
        </div>
      </div>

      <div className="w-[100%] mx-[0px] mt-0 pl-2">
        <div className="flex items-center">
          {showFullCaption && (
            <p className="text-sm tracking-tight font-thin overflow-hidden whitespace-nowrap text-overflow-ellipsis pl-2">
              {post.caption
                .split(' ')
                .slice(7)
                .reduce((result, word) => {
                  if (result.length + word.length + 1 <= 50) {
                    result.push(word);
                  }
                  return result;
                }, [])
                .join(' ')}
            </p>
          )}
        </div>
      </div>

      <div className="w-[100%] mx-[0px] pt-0 pl-2 ">
        <div
          onClick={handleCaptionToggle}
          className="flex flex-row items-start cursor-pointer"
        >
          <p className="text-xs font-extralight">{more}</p>
        </div>
      </div>
      <div className="w-[100%] mx-[0px] my-0.5 pl-2">
        <Link to={`/post/${post._id}/${0}/${true}/${false}`}>
          <div className="flex flex-row items-center">
            <p className="text-xs font-light text-gray-600">
              view {post.comments.length} comments
            </p>
          </div>
        </Link>
      </div>

      <div className="w-[100%] mx-[0px] my-0.5 pl-2 flex relative">
        <textarea
          rows={1}
          type="text"
          className="w-full pl-2 border-b-[0.5px] border-gray-300 outline-none py-1 text-sm font-extralight placeholder-gray-500"
          placeholder={sending ? 'posting comment...' : 'create a comment'}
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
  );
};

export default PostFeed;
