import React, { useEffect, useState } from 'react';
import { ImageCircle } from './ImageCircle';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';
import { useMyContext } from '../alertContext';
import {
  AiOutlinePhone,
  AiOutlineFileImage,
  AiOutlineVideoCamera,
  AiOutlineSend,
} from 'react-icons/ai';

import { FaDotCircle, FaRegDotCircle } from 'react-icons/fa';
import axios from 'axios';
import { LoadMessage } from './loadMessage';
import EmojiPicker from 'emoji-picker-react';
import {
  getTime,
  getTimeDifference,
  sendMessage,
  updateMessagehandler,
  fetchData,
  retrievedCookieValue,
  formSendingMessage,
} from './utilities';
import BasicAlerts from './alertComponent/alert';

import { useSocket } from '../MyContext';

const jwtToken = retrievedCookieValue();

export function Conversation({ sizes, limit, me, callaudioRef }) {
  const { showAlert } = useMyContext();
  const socket = useSocket();
  const { id } = useParams();
  const scrollContainerRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [otherUser, setOtherUser] = useState([]);
  const [EmojiActive, setEmojiActive] = useState(false);
  const [sending, setSending] = useState(false);

  const [lastActive, setLastActive] = useState('');
  const [online, setOnline] = useState(false);
  const [socketId, setSocketId] = useState(null);

  const handleMessageSending = async (tosend, type) => {
    setSending(true);
    const body = formSendingMessage({
      me: me,
      otherUser: otherUser.users[0],
      type: 'text',
      id: id,
      tosend: tosend,
    });
    try {
      const res = await sendMessage({
        url: `https://bobikit.onrender.com/api/v1/conversations/${id}`,
        requestBody: body,
        jwtToken: jwtToken,
        showAlert: showAlert,
      });
      const newmessage = res.data.doc;
      newmessage.checker = getTime(Date.now());
      setMessages((prevMessages) => [...prevMessages, newmessage]);
      socket.emit('messageSend', {
        userToMessage: socketId,
        from: socket.id,
        message: newmessage,
        conversation: id,
        user: me,
      });
    } catch (err) {
      showAlert({
        type: 'error',
        message: 'couldnt send messages..',
      });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    socket.on('messageReceived', async (data) => {
      if (socketId === data.from) {
        try {
          const res = await updateMessagehandler({
            messageid: data.message._id.toString(),
            jwtToken: jwtToken,
            id: id,
            showAlert: showAlert,
            seen: true,
          });
          socket.emit('Seen', { userToNotify: socketId, from: socket.id });
        } catch (err) {
          showAlert({
            type: 'error',
            message: 'couldnt update message status...',
          });
        }
        socket.emit('Seen', {
          userToNotify: socketId,
          from: socket.id,
        });
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    });

    socket.on('seen', (data) => {
      if (socketId === data.from) {
        setMessages((prevMessages) => {
          prevMessages[prevMessages.length - 1].seen = true;
          prevMessages[prevMessages.length - 1].delivered = true;
          return prevMessages;
        });
      }
    });

    socket.on('updatedelivered', (data) => {
      if (socketId === data.from) {
        setMessages((prevMessages) => {
          prevMessages[prevMessages.length - 1].delivered = true;
          return prevMessages;
        });
      }
    });

    return () => {
      socket.off('seen');
      socket.off('messageReceived');
    };
  }, [socketId]);

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
    window.scrollTo(0, document.body.scrollHeight);
  };

  const loadMoreMessages = async () => {
    if (!id || loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetchData({
        url: `https://bobikit.onrender.com/api/v1/conversations/${id}?page=${
          pageNumber * 1
        }&limit=${limit * 1}&sort=-createdAt`,
        jwtToken: jwtToken,
        showAlert: showAlert,
      });

      if (res.doc.length === 0) {
        setHasMore(false);
        setOtherUser(res.conversation);
      } else {
        try {
          setHasMore(true);
          const messagesWithCheckers = await Promise.all(
            res.doc.map(async (message) => {
              message.checker = getTime(message.createdAt);
              return message;
            }),
          );
          setOtherUser(res.conversation);
          setLastActive(
            getTimeDifference(res.conversation.users[0].lastActive),
          );
          setSocketId(res.conversation.users[0].socketId);
          setOnline(res.conversation.users[0].online ? true : false);
          if (
            pageNumber === 1 &&
            messagesWithCheckers[
              messagesWithCheckers.length - 1
            ].receiver.toString() === me._id.toString()
          ) {
            try {
              const res = await updateMessagehandler({
                messageid:
                  messagesWithCheckers[
                    messagesWithCheckers.length - 1
                  ]._id.toString(),
                jwtToken: jwtToken,
                id: id,
                showAlert: showAlert,
                seen: true,
              });
              socket.emit('Seen', { userToNotify: socketId, from: socket.id });
            } catch (err) {
              showAlert({
                type: 'error',
                message: 'couldnt update message status...',
              });
            }
          }
          setMessages((prevMessages) => [
            ...messagesWithCheckers,
            ...prevMessages,
          ]);
        } catch (err) {
          showAlert({
            type: 'error',
            message: 'couldnt load messages..',
          });
        }
      }
    } catch (error) {
      showAlert({
        type: 'error',
        message: 'couldnt load more messages...',
      });
    } finally {
      setLoading(false);
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  const handleScroll = () => {
    const scrollTop = scrollContainerRef.current.scrollTop;

    if (scrollTop === 0) {
      loadMoreMessages();
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, [messages]);

  const handleImageUpload = async (e) => {
    const formDataImage = new FormData();
    formDataImage.append(`image`, e.target.files[0]);
    const body = formSendingMessage({
      me: me,
      otherUser: otherUser.users[0],
      type: 'media',
      id: id,
      tosend: 'image',
    });

    try {
      const res = await sendMessage({
        url: `https://bobikit.onrender.com/api/v1/conversations/${id}`,
        requestBody: body,
        jwtToken: jwtToken,
        showAlert: showAlert,
      });

      const headers = {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        const resi = await axios
          .post(
            `https://bobikit.onrender.com/api/v1/users/createUploadMessageImage/${res.doc._id.toString()}`,
            formDataImage,
            {
              headers,
            },
          )
          .then((imageuploaded) => {
            showAlert({
              type: 'success',
              message: 'photo sent...',
            });
          })
          .catch((imagenotuploaded) => {
            showAlert({
              type: 'error',
              message: 'couldnt send the photo...',
            });
          });
      } catch (err) {
        showAlert({
          type: 'error',
          message: 'couldnt send the photo...',
        });
      }
    } catch (err) {
      showAlert({
        type: 'error',
        message: 'couldnt send the photo...',
      });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    setPageNumber(1);
    setMessages([]);
    setHasMore(true);
    if (id && pageNumber === 1 && messages.length === 0) {
      loadMoreMessages();
    }
  }, [id]);

  const renderMessages = () => {
    if (messages.length === 0) return '';
    return messages.map((message, index) => {
      return (
        <div className={`flex-col`} key={index}>
          <div className="flex justify-center">
            <p className="text-[9px] text-gray-400">{message.checker}</p>
          </div>
          <LoadMessage
            message={message}
            index={index}
            me={me}
            otherUser={otherUser}
            lastmessage={index === messages.length - 1 ? true : false}
            socket={socket}
            socketId={socketId}
          />
        </div>
      );
    });
  };

  return (
    <div className="pl-[8rem]" style={{ overflow: 'none' }}>
      <div className="w-[100%] mx-[1px] object-top flex flex-row my-4">
        <div className="flex items-start cursor-pointer pr-4 pl-2">
          <Link
            to={`/profile/${
              otherUser.users ? otherUser.users[0].username : 'username'
            }`}
          >
            <ImageCircle
              width={13}
              height={13}
              src={
                otherUser.users
                  ? otherUser.users[0].photo
                  : 'https://www.dropbox.com/scl/fi/3ov27e1679vea2d7auvwd/user.png?rlkey=k78rb7hpdqqawetzye1mpijjw&raw=1'
              }
              mb={0}
              borderWidth={0}
            />
          </Link>
        </div>
        <div className="flex cursor-pointer pt-2">
          <Link
            to={`/profile/${
              otherUser.users ? otherUser.users[0].username : 'username'
            }`}
          >
            <p className="text-sm font-semibold text-gray-600">
              {otherUser.users ? otherUser.users[0].username : 'username'}
            </p>
          </Link>

          <p
            className={
              online ? 'pl-4 pt-1  text-green-500' : 'pl-4 pt-1 text-gray-500'
            }
          >
            {online ? <FaDotCircle /> : <FaRegDotCircle />}
          </p>

          <p className={'pl-4 pt-1 text-xs font-semibold text-gray-500'}>
            {online ? '' : lastActive}
          </p>
        </div>
        <div className="flex-grow"></div> {/* Spacer */}
        <div className="flex pr-2 pt-1">
          <Link
            to={
              otherUser.users
                ? `/call/${me.username}/${socket.id}/${
                    otherUser.users[0].username
                  }/${
                    otherUser.users[0].socketId
                      ? otherUser.users[0].socketId
                      : 0
                  }/1/0`
                : ''
            }
          >
            <p className="text-xs text-gray-600">
              <AiOutlinePhone size={20} className="transform scale-x-[-1]" />
            </p>
          </Link>
        </div>
        <div className="flex pr-2 pt-1">
          <Link
            to={
              otherUser.users
                ? `/call/${me.username}/${socket.id}/${
                    otherUser.users[0].username
                  }/${
                    otherUser.users[0].socketId
                      ? otherUser.users[0].socketId
                      : 0
                  }/1/1`
                : ''
            }
          >
            <p className="text-xs text-gray-600">
              <AiOutlineVideoCamera size={20} />
            </p>
          </Link>
        </div>
      </div>
      <div
        className="w-[100%]"
        style={{
          borderBottom: '1px solid rgba(130,176,77,255)',
          opacity: 0.2,
        }}
      ></div>

      <div
        className="max-h-[600px] min-h-[600px] overflow-y-scroll"
        onScroll={handleScroll}
        ref={scrollContainerRef}
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.length > 0 && renderMessages()}
        {EmojiActive && <EmojiPicker onEmojiClick={handleEmojiSelect} />}
      </div>

      <div className="w-[100%] mx-[0px] object-bottom my-0.5 pr-4">
        <div className="flex relative">
          <textarea
            rows={1}
            className="w-full border-[0.5px] rounded-xl border-gray-300 outline-none py-1 text-sm font-extralight placeholder-gray-500 pl-10 ml-2 pr-10"
            placeholder={sending ? 'Sending...' : 'Message'}
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
          <p className="border-none cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 text-xl">
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleImageUpload(e);
                }}
                className="hidden"
              />
              <AiOutlineFileImage />
            </label>
          </p>

          {/* Send button */}

          {inputValue && (
            <button
              className="border-none cursor-pointer absolute right-8 top-1/2 transform -translate-y-1/2 text-xl"
              onClick={() => handleMessageSending(inputValue, 'text')}
            >
              <AiOutlineSend />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
