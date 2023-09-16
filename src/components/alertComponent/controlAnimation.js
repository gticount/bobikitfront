import React from 'react';
import Lottie from 'lottie-react';

const Animation = ({
  animationData,
  lottieRef,
  loop,
  children,
  sizes,
  opacity,
  autoplay,
  onclick,
}) => {
  const handleclick = () => {
    if (loop && onclick) {
      lottieRef.current.play();
    }
  };

  return (
    <div
      onClick={handleclick}
      className={
        sizes !== undefined
          ? `h-[${sizes}%] w-[${sizes}%] relative`
          : 'relative'
      }
    >
      <div className="z-30 absolute">
        <Lottie
          lottieRef={lottieRef}
          loop={loop}
          autoplay={autoplay}
          animationData={animationData}
        />
      </div>
      {children && (
        <div className={`z-10 relative`}>
          {opacity * 1 === 10 && (
            <div
              className={`bg-black w-[100%] h-[100%] opacity-10 rounded-full absolute z-50`}
            ></div>
          )}
          {opacity * 1 === 50 && (
            <div
              className={`bg-black w-[100%] h-[100%] opacity-50 rounded-full absolute z-50`}
            ></div>
          )}
          {children}
        </div>
      )}
    </div>
  );
};

export default Animation;
