import React from 'react';

const SearchPlaceholder = () => {
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
    height: '60px', // Increased the height for more space
    backgroundColor: '#f2f2f2',
    borderRadius: '8px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
  };

  const imageStyles = {
    width: '40px', // Increased the size of the "image"
    height: '40px', // Increased the size of the "image"
    backgroundColor: '#ddd',
    borderRadius: '50%',
    marginRight: '10px',
    animation: 'glowAnimation 1.5s infinite',
  };

  const textStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Vertically center the text
  };

  return (
    <div style={placeholderStyles}>
      <style>{keyframes}</style>
      <div style={imageStyles}></div>
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

export default SearchPlaceholder;
