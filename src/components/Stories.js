import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { StoriesActual } from './StoriesActual';

const Stories = ({ slides, sizes, limit, highlights }) => {
  const [firstIndex, setFirstIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(
    Math.min(slides.length - 1, limit - 1),
  );
  const [prevAvail, setPrevAvail] = useState(false);
  const [nextAvail, setNextAvail] = useState(slides.length - 1 >= limit - 1);

  const prevSlide = () => {
    if (firstIndex - (limit - 1) >= 0) {
      const tt = firstIndex;
      setFirstIndex(firstIndex - (limit - 1));
      setLastIndex(tt - 1);
      setNextAvail(true);
      if (firstIndex - (limit - 1) <= 0) setPrevAvail(false);
    }
  };

  const nextSlide = () => {
    if (lastIndex + (limit - 1) < slides.length - 1) {
      setFirstIndex(firstIndex + (limit - 1));
      setLastIndex(lastIndex + (limit - 1));
      setPrevAvail(true);
      if (lastIndex + (limit - 1) >= slides.length - 1) setNextAvail(false);
    } else {
      setFirstIndex(firstIndex + (limit - 1));
      setLastIndex(Math.min(lastIndex + (limit - 1), slides.length - 1));
      setNextAvail(false);
    }
  };

  useEffect(() => {
    setPrevAvail(firstIndex > 0);
    setNextAvail(slides.length - lastIndex - 1 > 0);
  }, [firstIndex, lastIndex, slides]);

  const transformX = -firstIndex * (100 / 1024);

  return (
    <div className="relative overflow-hidden justify-start">
      <div
        className="flex transition-transform"
        id="koyla"
        style={{ transform: `translateX(${transformX}%)` }}
      >
        <StoriesActual
          slides={slides}
          firstIndex={firstIndex}
          lastIndex={lastIndex}
          sizes={sizes}
          highlights={highlights}
          limit={limit}
        />
      </div>
      {prevAvail && (
        <div
          onClick={prevSlide}
          className={`cursor-pointer carousel-button absolute top-1/2 left-2 transform -translate-y-1/2 p-2 rounded-full transition-opacity z-10 mix-blend-normal`}
          style={{ background: 'rgb(107 114 128)' }} // Transparent background
        >
          <FaChevronLeft style={{ fill: 'white' }} />
        </div>
      )}
      {nextAvail && (
        <div
          onClick={nextSlide}
          className={`cursor-pointer carousel-button absolute top-1/2 right-2 transform -translate-y-1/2 p-2 rounded-full transition-opacity z-10 mix-blend-normal`}
          style={{ background: 'rgb(107 114 128)' }} // Transparent background
        >
          <FaChevronRight style={{ fill: 'white' }} />
        </div>
      )}
    </div>
  );
};

export default Stories;
