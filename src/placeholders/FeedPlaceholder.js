import React from 'react';

const FeedHolder = () => {
  const keyframes = `
    @keyframes glowAnimation {
      0%, 100% {
        opacity: 1;
        box-shadow: 0 0 8px rgba(58, 98, 14, 0.8);
      }
      50% {
        opacity: 0.8;
        box-shadow: none;
      }
    }
  `;

  const placeholderStyles = {
    width: '100%',
    height: '750px', // Increased the height for more space
    backgroundColor: '#f2f2f2',
    borderRadius: '8px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const imageStyles = {
    width: '40px', // Increased the size of the "image"
    height: '40px', // Increased the size of the "image"
    backgroundColor: '#ddd',
    borderRadius: '50%',
    marginRight: '10px',
    animation: 'glowAnimation 1.5s infinite',
    marginLeft: '10px',
    marginTop: '8px',
  };

  const textStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Vertically center the text
  };

  return (
    <div style={placeholderStyles}>
      <style>{keyframes}</style>
      <div
        style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}
      >
        <div style={imageStyles}></div>
        <div className="flex-grow"></div>
        <div
          style={{
            width: '50px',
            height: '16px',
            backgroundColor: '#ddd',
            marginTop: '16px',
            animation: 'glowAnimation 1.5s infinite',
            borderRadius: '20%',
            marginRight: '13px',
          }}
        ></div>
      </div>
      <div
        style={{
          width: '100%', // Increased the size of the "image"
          height: '500px', // Increased the size of the "image"
          backgroundColor: '#ddd',
          marginBottom: '20px',
          animation: 'glowAnimation 1.5s infinite',
        }}
      ></div>
      <div style={textStyles}>
        <div
          style={{
            width: '220px',
            height: '16px',
            backgroundColor: '#ddd',
            marginBottom: '8px',
            animation: 'glowAnimation 1.5s infinite',
            borderRadius: '10%',
          }}
        ></div>
        <div
          style={{
            width: '160px',
            height: '16px',
            backgroundColor: '#ddd',
            animation: 'glowAnimation 1.5s infinite',
            borderRadius: '10%',
          }}
        ></div>
      </div>
    </div>
  );
};

export default FeedHolder;
