import React from 'react';

const ProfileHolder = () => {
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
    height: '100%', // Increased the height for more space
    backgroundColor: 'white',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const imageStyles = {
    width: '160px', // Increased the size of the "image"
    height: '160px', // Increased the size of the "image"
    backgroundColor: '#ddd',
    borderRadius: '50%',
    marginRight: '60px',
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
      <div className="flex flex-col">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '10px',
          }}
        >
          <div style={imageStyles}></div>
          <div className="flex flex-col">
            <div className="flex flex-row">
              <div
                className="w-[100px] h-[30px] bg-[#ddd] mt-[16px] mr-[20px]"
                style={{
                  animation: 'glowAnimation 1.5s infinite',
                  borderRadius: '20%',
                }}
              ></div>

              <div
                className="w-[80px] h-[40px] bg-[#ddd] mt-[12px] mr-[13px] pl-4"
                style={{
                  animation: 'glowAnimation 1.5s infinite',
                  borderRadius: '20%',
                }}
              ></div>
            </div>

            <div className="flex flex-row">
              <div
                className="w-[60px] h-[20px] bg-[#ddd] mt-[16px] mr-[12px]"
                style={{
                  animation: 'glowAnimation 1.5s infinite',
                  borderRadius: '20%',
                }}
              ></div>

              <div
                className="w-[60px] h-[20px] bg-[#ddd] mt-[16px] mr-[12px] pl-4"
                style={{
                  animation: 'glowAnimation 1.5s infinite',
                  borderRadius: '20%',
                }}
              ></div>
              <div
                className="w-[60px] h-[20px] bg-[#ddd] mt-[16px] mr-[12px] pl-4"
                style={{
                  animation: 'glowAnimation 1.5s infinite',
                  borderRadius: '20%',
                }}
              ></div>
            </div>

            <div
              className="w-[100px] h-[20px] bg-[#ddd] mt-[16px] mr-[13px]"
              style={{
                animation: 'glowAnimation 1.5s infinite',
                borderRadius: '20%',
              }}
            ></div>

            <div
              className="w-[150px] h-[20px] bg-[#ddd] mt-[12px] mr-[13px] pl-4"
              style={{
                animation: 'glowAnimation 1.5s infinite',
                borderRadius: '20%',
              }}
            ></div>
          </div>
        </div>

        <div className="flex flex-row mt-40">
          <div
            className="w-[300px] h-[300px] bg-[#ddd] mr-[10px] mt-[8px]"
            style={{
              animation: 'glowAnimation 1.5s infinite',
            }}
          ></div>

          <div
            className="w-[300px] h-[300px] bg-[#ddd] mr-[10px] mt-[8px]"
            style={{
              animation: 'glowAnimation 1.5s infinite',
            }}
          ></div>

          <div
            className="w-[300px] h-[300px] bg-[#ddd] mr-[10px] mt-[8px]"
            style={{
              animation: 'glowAnimation 1.5s infinite',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHolder;
