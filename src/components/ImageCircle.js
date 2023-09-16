import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import Animation from './alertComponent/controlAnimation';
import animationData from '../animations/story.json';
import storyfade from '../animations/storyfade.json';

export function ImageCircle({
  width,
  height,
  src,
  mb,
  borderWidth,
  highlights,
  showanimation,
  seen,
  muted,
}) {
  const lottieRef = useRef(null);

  const containerStyle = {
    width: `${width * 3}px`,
    height: `${height * 3}px`,
    position: 'relative',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  };

  const borderStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: `${borderWidth}px solid ${
      highlights ? 'rgba(255,102,196,1)' : 'rgba(255,102,196,1)'
    }`,
    borderRadius: '50%',
    zIndex: 1,
    pointerEvents: 'none',
  };

  return (
    <div
      className={`rounded-full overflow-hidden w-${width} h-${height} mb-${mb} relative border-${borderWidth} border-${
        !highlights ? '[rgba(130,176,77,255)]' : '[rgba(130,176,77,255)]'
      }`}
    >
      {showanimation && (
        <div style={containerStyle}>
          <Animation
            lottieRef={lottieRef}
            animationData={seen || muted ? storyfade : animationData}
            loop={true}
            autoplay={false}
            sizes={100}
            onclick={true}
            children={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative', // Adjust the size of the image container
                }}
              >
                <img
                  src={src}
                  alt="img"
                  className="rounded-full object-cover"
                />
              </div>
            }
            opacity={!muted && !seen ? 0 : muted && !seen ? 50 : 10}
          />
        </div>
      )}
      {!showanimation && (
        <div style={containerStyle}>
          <img src={src} alt="img" style={imageStyle} />
          <div style={borderStyle}></div>
        </div>
      )}
    </div>
  );
}
