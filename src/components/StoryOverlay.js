import React, { useState, useEffect } from 'react';

import { FaHeart } from 'react-icons/fa';

import { ImageCircle } from './ImageCircle';
import { Link } from 'react-router-dom';
import { getTimeDifference } from './utilities';
import ProgressBar from '@ramonak/react-progress-bar';
import { AudioPlayer } from './audioPlayer';
import EmojiPicker from 'emoji-picker-react';
import { useMyContext } from '../alertContext';
import { AiFillEye } from 'react-icons/ai';
import { FollowersPopup } from './followerspopup';
import { AiFillDelete } from 'react-icons/ai';
import {
  formSendingMessage,
  retrievedCookieValue,
  sendMessage,
  createMessage,
  findCommonElement,
  handleLiker,
} from './utilities';

import axios from 'axios';

import { AiOutlineSend } from 'react-icons/ai';

const StoryOverlay = ({
  story,
  me,
  showStory,
  setShowStory,
  navigate,
  index,
  seenData,
}) => {
  const { showAlert } = useMyContext();
  const jwtToken = retrievedCookieValue();
  const [progress, setProgress] = useState(Array(story.stories.length).fill(0));
  const [like, setLike] = useState(
    story.stories[index].likes.some((id) => id === me._id),
  );

  const [startTimer, setStartTimer] = useState(false);
  const [audioduration, setAudioDuration] = useState(null);

  const [currentAction, setCurrentAction] = useState(null);
  const [activeIndex, setActiveIndex] = useState(index * 1);
  const [inputValue, setInputValue] = useState('');

  const [EmojiActive, setEmojiActive] = useState(false);
  const [sending, setSending] = useState(false);
  const [setData, setsetData] = useState([]);
  const [popupactivated, setPopupActivated] = useState(false);
  const [findWhich, setFindWhich] = useState(null);

  const setpop = (e) => {
    setsetData(e);
    setPopupActivated(true);
  };

  const handleStoryDelete = async () => {
    try {
      const res = await axios.delete(
        `https://bobikit.onrender.com/api/v1/stories/${story.stories[
          activeIndex
        ]._id.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      showAlert({
        type: 'info',
        message: 'story deleted',
      });
      navigate('/');
    } catch (err) {
      showAlert({
        type: 'error',
        message: 'couldnt perform the delete action',
      });
    }
  };

  const handleLike = () => {
    try {
      handleLiker({
        type: 'stories',
        id: story.stories[index]._id.toString(),
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

  useEffect(() => {
    if (currentAction) {
      if (
        currentAction === 'increase' &&
        activeIndex < story.stories.length - 1
      ) {
        setActiveIndex(activeIndex + 1);
      } else if (currentAction === 'decrease' && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
      setCurrentAction(null);
    }
  }, [currentAction]);

  useEffect(() => {
    let interval;
    if (startTimer && audioduration) {
      if (showStory) {
        interval = setInterval(() => {
          setProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            newProgress[activeIndex] += 300 / (audioduration * 10);
            return newProgress;
          });
        }, 300);

        setTimeout(() => {
          clearInterval(interval);
          if (activeIndex >= story.stories.length - 1) {
            setShowStory(false);
            navigate(-1);
          } else setCurrentAction('increase');
        }, audioduration * 1000);
      }

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [showStory, activeIndex, startTimer]);

  const handleMessageSending = async (tosend, type) => {
    setSending(true);
    async function senddm(conversationid) {
      try {
        const body = formSendingMessage({
          me: me,
          otherUser: story.user,
          type: 'text',
          id: conversationid,
          tosend: tosend,
        });
        const res = await sendMessage({
          url: `https://bobikit.onrender.com/api/v1/conversations/${conversationid}`,
          requestBody: body,
          jwtToken: jwtToken,
          showAlert: showAlert,
        });
        setSending(false);
      } catch (err) {
        showAlert({
          type: 'error',
          message: 'Couldnt send Message...',
        });
      }
    }

    const commonElements = findCommonElement(
      me.conversations,
      story.user.conversations,
    );
    setSending(true);
    if (commonElements.length === 0) {
      const res = await createMessage({
        firstuser: me._id,
        seconduser: story.user._id,
        jwtToken: jwtToken,
        showAlert: showAlert,
      });
      await senddm(res.doc._id.toString());
    } else {
      await senddm(commonElements[0]);
    }
  };

  const handleTextareaKeyDown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      handleMessageSending(inputValue, 'text');
      setInputValue('');
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
    <div className="flex justify-center items-center w-full h-[90vh]">
      <div className="absolute inset-[20rem] flex justify-center items-center">
        <div className="w-[25rem] h-[90vh] overflow-hidden">
          <div className="relative">
            <div className="z-30 w-full flex flex-row">
              {story.stories.map((x, indi) => (
                <div className="flex-grow px-1" key={indi}>
                  <ProgressBar
                    baseBgColor={'rgb(203 213 225)'}
                    completed={progress[indi]}
                    isLabelVisible={false}
                    height="4px"
                    bgColor={'rgb(255 255 255)'}
                  />
                </div>
              ))}
            </div>

            {
              <div className="relative z-30 ">
                <div className="absolute top-0 left-0 right-0 h-[60px] bg-gradient-to-b from-transparent to-[rgba(0, 0, 0, 0.5)] backdrop-blur-[1.5px]"></div>
                <div className="border-[0.5px] rounded-2xl border-[rgba(255,102,196,1)]">
                  <AudioPlayer
                    post={story.stories}
                    setCurrentAction={setCurrentAction}
                    activeIndex={activeIndex}
                    audioRef={React.createRef()}
                    medium="story"
                    approach="story"
                    setStartTimer={setStartTimer}
                    setAudioDuration={setAudioDuration}
                    me={me}
                  />
                </div>
              </div>
            }
            <div className="absolute inset-0 z-40 justify-center">
              <div className="w-[30rem] mx-[1px] bg-[rgba(0, 0, 255, 0.3)] opacity-100 flex flex-row mt-4 mb-2 z-30">
                <div className="flex items-start cursor-pointer pr-4 pl-2">
                  <Link to={`/profile/${story.user.username}`}>
                    <ImageCircle
                      width={14}
                      height={14}
                      src={story.user.smallPhoto}
                      mb={0}
                      borderWidth={0}
                    />
                  </Link>
                </div>
                <div className="flex cursor-pointer pt-1">
                  <Link to={`/profile/${story.user.username}`}>
                    <p className="text-sm font-semibold text-white">
                      {story.user.username}
                    </p>
                  </Link>
                </div>
                <div className="flex-grow"></div> {/* Spacer */}
                <div className="flex pr-2 pt-1">
                  <p className="text-xs text-white">
                    {getTimeDifference(story.stories[index].createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex-grow" />

              {popupactivated && (
                <div className="z-50">
                  <FollowersPopup
                    which={findWhich}
                    user={me._id.toString()}
                    jwtToken={jwtToken}
                    setPopupActivated={setPopupActivated}
                    setData={setData}
                  />
                </div>
              )}

              <div className="absolute bottom-[50px] left-0 right-0 h-[150px] bg-gradient-to-b from-transparent to-[rgba(0, 0, 0, 0.5)] backdrop-blur-[1.5px]"></div>
              {EmojiActive && (
                <div className="max-w-20 max-h-40">
                  <EmojiPicker onEmojiClick={handleEmojiSelect} />
                </div>
              )}

              <div className="w-full pl-2 mx-[0px] my-0.5 z-30 flex items-center justify-between absolute bottom-[5rem]">
                <div className="flex relative w-[100%]">
                  <textarea
                    rows={1}
                    className="w-[90%] border-[0.5px] rounded-xl border-gray-300 outline-none py-1 text-sm font-extralight placeholder-gray-500 pl-10 ml-2 pr-10"
                    placeholder={
                      sending ? 'sending...' : `Reply to ${story.user.name}`
                    }
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => handleTextareaKeyDown(e)}
                  />

                  {/*  emoji button */}
                  <p
                    className="border-none cursor-pointer absolute left-2 top-1/2 transform -translate-y-1/2 text-xl"
                    onClick={() => EmojiActiveHandler(EmojiActive)}
                  >
                    😀
                  </p>

                  {/* image upload */}

                  {/* Send button */}
                </div>

                {story.user._id.toString === me._id.toString() && (
                  <div
                    className={`z-30 bg-gray-100 text-gray-400 rounded-full cursor-pointer`}
                    onClick={() => {
                      handleStoryDelete();
                    }}
                  >
                    <AiFillDelete size={20} />
                  </div>
                )}

                {story.user._id.toString === me._id.toString() && (
                  <div
                    className={`z-30 bg-gray-100 text-gray-400 rounded-full cursor-pointer`}
                    onClick={() => {
                      setpop(seenData[activeIndex]);
                    }}
                  >
                    <AiFillEye size={20} />
                  </div>
                )}

                <FaHeart
                  onClick={handleLike}
                  className={`font-normal z-30 w-[10%] hover:stroke-gray-600 stroke-black  ${
                    like
                      ? 'fill-red-500 stroke-[1px] stroke-gray-600'
                      : 'fill-transparent stroke-[30px]'
                  } `}
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryOverlay;
