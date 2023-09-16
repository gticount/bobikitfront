import React, { useState, useRef, useEffect } from 'react';
import { ImageCircle } from './ImageCircle';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const Stories = ({ slides, sizes }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Check if the carousel overflows the container
    const isCarouselOverflowed =
      carouselRef.current.scrollWidth > carouselRef.current.clientWidth;

    // If the carousel overflows, show the buttons; otherwise, hide them
    if (isCarouselOverflowed) {
      showButtons();
    } else {
      hideButtons();
    }
  }, [slides, activeSlide]); // Listen for changes in slides and activeSlide

  const nextSlide = () => {
    setActiveSlide((prevSlide) =>
      prevSlide + 1 >= slides.length ? 0 : prevSlide + 1,
    );
  };

  const prevSlide = () => {
    setActiveSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1,
    );
  };

  const showButtons = () => {
    document.querySelectorAll('.carousel-button').forEach((button) => {
      button.style.opacity = 1;
      button.style.pointerEvents = 'auto';
    });
  };

  const hideButtons = () => {
    document.querySelectorAll('.carousel-button').forEach((button, index) => {
      if (index === 0 && activeSlide === 0) {
        // Hide and disable previous button on the first slide
        button.style.opacity = 0;
        button.style.pointerEvents = 'none';
      } else if (index === 1 && activeSlide === slides.length - 1) {
        // Hide and disable next button on the last slide
        button.style.opacity = 0;
        button.style.pointerEvents = 'none';
      } else {
        button.style.opacity = 1;
        button.style.pointerEvents = 'auto';
      }
    });
  };

  return (
    <div className="relative overflow-hidden">
      <div
        ref={carouselRef}
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(-${activeSlide * (100 / 8)}%)`,
          width: `${Math.ceil(slides.length / 8) * 100}%`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-1/50 pl-2 pr-2"
            style={{
              opacity: index >= activeSlide && index < activeSlide + 8 ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            {/* Render your slide content here */}
            <div className="mr-2 flex items-center">
              <ImageCircle
                width={sizes}
                height={sizes}
                src={slide.content}
                mb={0}
                circleColor="rgba(244, 127, 36, 0.8)"
                borderWidth={4}
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-2 font-serif font-light">
              {slide.caption.split(' ')[0].slice(0, 6).toLowerCase()}...
            </p>
          </div>
        ))}
      </div>
      <div
        onClick={prevSlide}
        className={`cursor-pointer carousel-button absolute top-1/3 left-2 transform -translate-y-1/2 p-2 rounded-full transition-opacity z-10 ${
          activeSlide === 0 ? 'pointer-events-none' : ''
        } mix-blend-normal`}
        style={{ background: 'rgba(255, 255, 255, 0.9)' }} // Transparent background
      >
        <FaChevronLeft style={{ fill: 'black' }} />
      </div>
      <div
        onClick={nextSlide}
        className={`cursor-pointer carousel-button absolute top-1/3 right-2 transform -translate-y-1/2 p-2 rounded-full transition-opacity z-10 ${
          activeSlide === slides.length - 1 ? 'pointer-events-none' : ''
        } mix-blend-normal`}
        style={{ background: 'rgba(255, 255, 255, 0.9)' }} // Transparent background
      >
        <FaChevronRight style={{ fill: 'black' }} />
      </div>
    </div>
  );
};

export default Stories;
