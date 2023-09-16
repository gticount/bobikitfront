import React, { useEffect, useState } from 'react';
import { ImageCircle } from './ImageCircle';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { retrievedCookieValue } from './utilities';
import { useMyContext } from '../alertContext';

export function LoadMessage({
  message,
  index,
  me,
  otherUser,
  lastmessage,
  socket,
  socketId,
}) {
  const jwtToken = retrievedCookieValue();
  const { showAlert } = useMyContext();
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: message.sender === me._id.toString() ? '-500px' : 0,
  });

  const handleContextMenu = (e) => {
    e.preventDefault();
    const leftPosition =
      message.sender === me._id.toString() ? e.clientX - 300 : e.clientX; // Adjust 150 as needed
    setContextMenuVisible(true);
    setContextMenuPosition({ top: e.clientY, left: leftPosition + 'px' });
  };

  const handleReact = async (val) => {
    try {
      const res = await axios.patch(
        `https://bobikit.onrender.com/api/v1/conversations/${message.conversation}/${message._id}`,
        { likes: val },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      socket.emit('Reacted', {
        userToMessage: socketId,
        from: socket.id,
        react: val,
        messageid: message._id,
        user: me.name,
      });
      message.likes = val;
    } catch (err) {
      showAlert({
        type: 'error',
        message: 'couldnt react try again',
      });
    }
  };

  socket.on('okReact', (data) => {
    if (message && message._id && data.messageid) {
      if (message._id === data.messageid) {
        message.likes = data.react;
      }
    }
  });

  return (
    <div className="pt-8 mb-4" key={index}>
      <style>
        {`
          .context-menu {
            position: absolute;
            background: white;
            border: 1px solid #ccc;
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: row;
          }
          .context-menu ul {
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: row;
          }
          .context-menu li {
            padding: 10px;
            cursor: pointer;
            user-select: none;
          }
          .context-menu li:hover {
            background-color: #f0f0f0;
          }
        `}
      </style>
      {contextMenuVisible && (
        <div
          className="context-menu"
          style={{
            top: contextMenuPosition.top,
            left: contextMenuPosition.left,
          }}
          onMouseLeave={() => setContextMenuVisible(false)}
        >
          {message.sender !== me._id.toString() && (
            <ul>
              <li onClick={() => handleReact('😂')}>😂</li>
              <li onClick={() => handleReact('❤️')}>❤️</li>
              <li onClick={() => handleReact('🔥')}>🔥</li>
              <li onClick={() => handleReact('😅')}>😅</li>
              <li onClick={() => handleReact('😭')}>😭</li>
              <li onClick={() => handleReact('🥲')}>🥲</li>
            </ul>
          )}
        </div>
      )}
      {message.sender.toString() !== me._id.toString() ? (
        <div className="flex flex-col">
          <div className="flex flex-row">
            <Link to={`/profile/${message.sender}`}>
              <ImageCircle
                width={17}
                height={17}
                src={otherUser.users[0].photo}
                mb={0}
                circleColor="rgba(153, 153, 255,0.5)"
                borderWidth={0}
                className="w-[5%]"
              />
            </Link>
            <div
              onContextMenu={handleContextMenu}
              className="flex text-gray-900 text-xs pl-4 pt-3"
            >
              {message.type === 'text' ? (
                <p className="bg-gray-100 p-2 rounded-lg text-gray-900">
                  {message.content}
                </p>
              ) : (
                <img
                  src={message.content}
                  alt="img"
                  className="w-[150px] h-[300px] object-cover rounded-none"
                />
              )}
            </div>
          </div>
          <p className="pl-16">{message.likes}</p>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="flex-grow"></div>
            <div className="flex text-gray-100 text-xs pr-4 pt-3">
              <div onContextMenu={handleContextMenu} className="flex-col">
                {message.type === 'text' ? (
                  <p className=" bg-pink-500 p-2 rounded-lg">
                    {message.content}
                  </p>
                ) : (
                  <img
                    src={message.content}
                    alt="img"
                    className="w-[150px] h-[300px] object-cover rounded-none"
                  />
                )}
                <p className="flex pr-2 pb-2">{message.likes}</p>
                <div className="flex pt-2 text-black">
                  {lastmessage &&
                    message.sender.toString() === me._id.toString() && (
                      <p>
                        {message.delivered
                          ? message.seen
                            ? 'Seen'
                            : 'Delivered'
                          : 'Sent'}
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
