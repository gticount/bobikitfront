import React from 'react';
import { ImageCircle } from './ImageCircle';
import { Link } from 'react-router-dom';

export function StoriesActual({
  slides,
  firstIndex,
  lastIndex,
  sizes,
  highlights,
}) {
  return (
    <div className="flex justify-start">
      {slides.slice(firstIndex, lastIndex + 1).map((slide, index) => (
        <Link
          key={`story-${index}`}
          to={`/story/${firstIndex + index}/${slide.index}`}
        >
          <div key={`story-${index}`} className="w-1/8 p-1 mr-2 justify-start">
            <div className=" items-start">
              <ImageCircle
                width={sizes}
                height={sizes}
                src={slide.user.photo ? slide.user.smallPhoto : slide.content}
                mb={0}
                borderWidth={3}
                highlights={highlights}
                showanimation={true}
                seen={slide.seen}
                muted={slide.muted}
              />
            </div>
            <p className="text-center text-xs text-gray-600 mt-2 font-light">
              {slide.user.username
                ? `${slide.user.username.slice(0, 5)}..`
                : 'username'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
