import React, { useState, useEffect, useRef } from 'react';

import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

import { BiSolidVolumeMute, BiSolidVolumeFull } from 'react-icons/bi';
import { useParams, useNavigate } from 'react-router-dom';
import { useMyContext } from '../alertContext';
import axios from 'axios';
import { retrievedCookieValue } from './utilities';
import { FollowersPopup } from './followerspopup';
const jwtToken = retrievedCookieValue();

export function AudioPlayer({
  setCurrentAction,
  activeIndex,
  audioRef,
  post,
  medium,
  approach,
  setStartTimer,
  setAudioDuration,
  me,
}) {
  const { showAlert } = useMyContext();
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [visibility, setVisibility] = useState(0);
  const { section, id } = useParams();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [muteStatus, setMuteStatus] = useState(true);
  const [showAudio, setShowAudio] = useState(false);
  const componentRef = useRef();
  let nextImage;
  let prevImage;
  if (approach === 'story') {
    nextImage = post.length - 1 > activeIndex;
    prevImage = activeIndex > 0;
  } else {
    nextImage = post.content.length - 1 > activeIndex;
    prevImage = activeIndex > 0;
  }

  const handelSeen = async () => {
    if (medium === 'story') {
      let body;
      if (post[activeIndex].seen.includes(me._id.toString())) {
        body = post[activeIndex].seen;
      } else {
        body = [...post[activeIndex].seen, me._id.toString()];
      }
      try {
        const res = await axios.patch(
          `https://bobikit.onrender.com/api/v1/stories/${post[
            activeIndex
          ]._id.toString()}`,
          { seen: body, pass: true },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
      } catch (err) {
        const a = err;
      }
    }
  };

  useEffect(() => {
    if (section && medium === 'feed' && visibility > 50) {
      setMuteStatus(false);
      audioRef.current.muted = true;
    }
  }, [section]);

  useEffect(() => {
    if ((medium === 'post' || medium === 'story') && isImageLoaded) {
      audioRef.current.preload = 'auto';
      audioRef.current.loop = true;
      if (isAudioLoaded) {
        if (setAudioDuration) setAudioDuration(audioRef.current.duration);
        if (setStartTimer) setStartTimer(true);
        audioRef.current.play();
      }
    }
  }, [medium, isImageLoaded, isAudioLoaded]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // Calculate the visible portion as a percentage of the component's height
          const visiblePercentage = (entry.intersectionRatio * 100).toFixed(2);
          setVisibility(visiblePercentage);
        } else {
          // Component is not in the viewport
          setVisibility(0);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1], // You can adjust these thresholds
      },
    );

    observer.observe(componentRef.current);

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (medium === 'feed' && isImageLoaded) {
      if (visibility > 50 && muteStatus) {
        audioRef.current.preload = 'auto';
        audioRef.current.loop = true;
        if (isAudioLoaded) audioRef.current.play();
      } else if (audioRef.current.currentTime > 0) {
        audioRef.current.pause();
      }
    }
  }, [medium, visibility, isImageLoaded, isAudioLoaded, muteStatus]);

  return (
    <div
      ref={componentRef}
      className="relative"
      onMouseEnter={() => {
        setShowAudio(true);
      }}
      onMouseLeave={() => {
        setShowAudio(false);
      }}
    >
      {prevImage && isImageLoaded && (
        <div
          onClick={() => {
            setCurrentAction('decrease');
          }}
          className={`cursor-pointer carousel-button absolute top-1/2 left-1 p-2 rounded-full transition-opacity z-10 ${
            prevImage === null ? 'pointer-events-none' : ''
          } mix-blend-normal`}
          style={{ background: 'rgb(107 114 128)' }} // Transparent background
        >
          <FaChevronLeft style={{ fill: 'white' }} />
        </div>
      )}

      <div className="border-[0.5px] rounded-2xl border-[rgba(255,102,196,1)]">
        <img
          src={approach ? post[activeIndex].content : post.content[activeIndex]}
          alt="img"
          className="w-full z-30 h-full object-cover rounded-2xl"
          style={{ verticalAlign: 'bottom' }}
          onLoad={async () => {
            setIsImageLoaded(true);
            setShowAudio(true);
            setTimeout(() => {
              setShowAudio(false);
            }, 3000);
            if (medium === 'story') await handelSeen();
          }} // Mark image loaded
        />
        <audio
          ref={audioRef}
          preload="none"
          onCanPlay={() => setIsAudioLoaded(true)}
        >
          <source
            src={
              approach === 'story'
                ? post[activeIndex].contentAudio
                : post.contentAudio[activeIndex]
            }
            type="audio/mpeg"
          />
        </audio>
        {!muteStatus && showAudio && (
          <div
            className={` z-60 absolute bg-gray-100 text-gray-400 rounded-full ${
              medium === 'story' ? 'top-8' : 'bottom-4'
            } right-4 cursor-pointer`}
            onClick={() => {
              setMuteStatus(true);
              audioRef.current.muted = false;
            }}
          >
            <BiSolidVolumeMute size={20} />
          </div>
        )}
        {muteStatus && showAudio && (
          <div
            className={` z-60 absolute bg-gray-100 text-gray-400 rounded-full ${
              medium === 'story' ? 'top-8' : 'bottom-4'
            } right-4 cursor-pointer`}
            onClick={() => {
              setMuteStatus(false);
              audioRef.current.muted = true;
            }}
          >
            <BiSolidVolumeFull size={20} />
          </div>
        )}
      </div>

      {nextImage && isImageLoaded && (
        <div
          onClick={() => {
            setCurrentAction('increase');
          }}
          className={` cursor-pointer carousel-button absolute top-1/2 right-1  p-2 rounded-full transition-opacity z-10 ${
            nextImage === null ? 'pointer-events-none' : ''
          } mix-blend-normal`}
          style={{ background: 'rgb(107 114 128)' }} // Transparent background
        >
          <FaChevronRight style={{ fill: 'white' }} />
        </div>
      )}
    </div>
  );
}
