import React from 'react';
import { ImageCircle } from './ImageCircle';
import { Link } from 'react-router-dom';
import { getTimeDifference } from './utilities';

export function Messages({ users }) {
  return (
    <div className="flex pt-8 flex-col mb-8">
      {users.map((slide, itndex) => (
        <Link key={`story-${itndex}`} to={`/message/${slide._id}`}>
          <div key={`story-${itndex}`} className="flex-row pt-8">
            <div className="ml-1 flex">
              <ImageCircle
                width={17}
                height={17}
                src={slide.users[0].largePhoto}
                mb={0}
                circleColor="rgba(153, 153, 255,0.5)"
                borderWidth={0}
                className="w-[18%]"
              />
              <div className="w-[80%] flex-col pl-4 pt-3">
                <p className="text-xs text-gray-900 mb-1">
                  {slide.users[0].name}
                </p>
                <div className="text-xs text-gray-400 font-serif font-extralight flex flex-row">
                  <p className="text-xs text-gray-400 font-serif font-extralight">
                    {slide.lastMessage
                      ? slide.lastMessage.sender === slide.users[0]._id
                        ? `${slide.users[0].name.split(' ')[0]} sent u a ${
                            slide.lastMessage.type
                          }`
                        : `you sent a ${slide.lastMessage.type}`
                      : 'The message was deleted'}
                  </p>
                  <p className="text-[10px]">
                    {slide.lastMessage &&
                      ` .   ${getTimeDifference(slide.lastMessage.createdAt)
                        .split(' ')
                        .slice(0, 2)
                        .join(' ')}`}
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
