import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchData, retrievedCookieValue } from './utilities';
import Cookies from 'js-cookie';

import {
  FaVideo,
  FaMicrophone,
  FaVideoSlash,
  FaVolumeUp,
  FaVolumeMute,
  FaMicrophoneSlash,
} from 'react-icons/fa';

import { ImPhoneHangUp } from 'react-icons/im';
import { useSocket } from '../MyContext';

function VideoCall() {
  const socket = useSocket();
  const navigate = useNavigate();
  const callerSignal = JSON.parse(localStorage.getItem('callerSignal'));
  const { sender, receiver, which, senderid, receiverid, camera } = useParams();
  const me = socket.id;
  const [streaming, setStreaming] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [calling, setCalling] = useState(false);

  const [myData, setMyData] = useState([]);
  const [otherData, setOtherData] = useState([]);

  const [cameraOn, setCameraOn] = useState(camera * 1 === 1 ? true : false);
  const [microphoneOn, setMicrophoneOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [callStatus, setCallStatus] = useState(
    receiver * 1 === 0 ? 'Calling' : 'Ringing',
  );

  const audio = new Audio(
    'https://www.dropbox.com/scl/fi/asi0wsrxqcdgf8hpoquov/call.mp3?rlkey=jrru76gij8xb2upe9wqd2kf3z&raw=1',
  );
  audio.loop = true;

  const userVideo = useRef();
  const connectionRef = useRef();
  const myVideo = useRef();
  const myVideoDuringCall = useRef();
  const jwtToken = retrievedCookieValue();

  useEffect(() => {
    fetchData(
      `https://bobikit.onrender.com/api/v1/users/${receiverid}`,
      jwtToken,
    ).then((res) => {
      setOtherData(res.user);
    });
    fetchData(
      `https://bobikit.onrender.com/api/v1/users/${senderid}`,
      jwtToken,
    ).then((res) => {
      setMyData(res.user);
    });
  }, [sender, senderid, receiverid, which, receiver]);

  useEffect(() => {
    if (streaming) {
      setStreaming((stream) => {
        stream.getAudioTracks()[0].enabled = microphoneOn;
        stream.getVideoTracks()[0].enabled = cameraOn;
        return stream;
      });
    }
  }, [cameraOn, microphoneOn, speakerOn]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        stream.getVideoTracks()[0].enabled = cameraOn;
        setStreaming(stream);
        if (myVideo) myVideo.current.srcObject = stream;
      });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: streaming,
    });

    peer.on('signal', (data) => {
      setCalling(true);
      audio.play();
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: me,
        username: myData.username,
      });
    });

    socket.on('callAccepted', (signal) => {
      setCalling(false);
      audio.pause();
      setCallAccepted(true);
      peer.signal(signal);
    });

    peer.on('stream', (stream) => {
      if (userVideo.current && myVideoDuringCall.current) {
        userVideo.current.srcObject = stream;
        myVideoDuringCall.current.srcObject = streaming;
      }
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: streaming,
    });
    console.log('call accepted 0');

    peer.on('signal', (data) => {
      setCallAccepted(true);
      socket.emit('answerCall', { signal: data, to: sender });
    });
    console.log('call accepted 1');

    peer.on('stream', (stream) => {
      if (userVideo.current) userVideo.current.srcObject = stream;
      if (myVideoDuringCall.current)
        myVideoDuringCall.current.srcObject = streaming;
    });
    console.log('call accepted 2');

    peer.signal(callerSignal);
    connectionRef.current = peer;

    console.log('call accepted 3');
  };

  const leaveCall = () => {
    setCallEnded(true);
    setCalling(false);
    setCallAccepted(false);
    audio.pause();
    Cookies.remove('callerSignal');

    connectionRef.current.destroy();

    navigate('/');
  };

  return (
    <>
      <div className="bg-black h-screen flex justify-center items-center">
        {!calling && !callAccepted && (
          <div className="flex flex-row gap-8">
            {/* Left panel */}
            <div className="flex flex-col items-center text-white">
              {
                <video
                  className="w-[600px] h-[400px] bg-gray-900"
                  playsInline
                  muted
                  ref={myVideo}
                  autoPlay
                />
              }
              <div className="bg-gray-800 w-[100%] flex flex-row justify-center gap-4 p-2">
                <p
                  onClick={() => setCameraOn(!cameraOn)}
                  className="text-white bg-gray-700 rounded-full p-2"
                >
                  {cameraOn ? (
                    <FaVideo size={30} />
                  ) : (
                    <FaVideoSlash size={30} />
                  )}
                </p>
                <p
                  onClick={() => setMicrophoneOn(!microphoneOn)}
                  className="text-white bg-gray-600 rounded-full p-2"
                >
                  {microphoneOn ? (
                    <FaMicrophone size={30} />
                  ) : (
                    <FaMicrophoneSlash size={30} />
                  )}
                </p>
                <p
                  onClick={() => setSpeakerOn(!speakerOn)}
                  className="text-white bg-gray-600 rounded-full p-2"
                >
                  {speakerOn ? (
                    <FaVolumeUp size={30} />
                  ) : (
                    <FaVolumeMute size={30} />
                  )}
                </p>
              </div>
            </div>

            {/* Right panel */}
            <div className="flex flex-col items-center bg-gray-900 text-white">
              <div className="flex flex-col justify-center items-center p-8">
                <img
                  src={which * 1 === 1 ? otherData.photo : myData.photo}
                  className="rounded-full w-[15rem]"
                  alt="imagepic"
                />
                <span className="text-white font-bold text-lg p-1">
                  {which * 1 === 1 ? otherData.name : myData.name}
                </span>
                <span className="text-white text-sm">
                  Ready to have Conversation ?
                </span>
                <div className="text-white">
                  <button
                    className="text-white hover:bg-[rgba(58,98,14,1)] bg-[rgba(130,176,77,255)] mr-6 text-sm rounded-md m-4 px-2"
                    onClick={() => {
                      if (which * 1 === 1) callUser(receiver);
                      else answerCall();
                    }}
                  >
                    {which * 1 === 1 ? 'Call' : 'Join'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {((callAccepted && !callEnded) || calling) && (
          <div className="w-[100%] h-[100%]">
            <div>
              {(callAccepted || calling) && (
                <div className="justify-center object-center items-center h-screen">
                  {callAccepted === false ? (
                    <img
                      className="fixed top-0 left-0 w-screen h-screen blur-2xl opacity-60 z-10"
                      src={which * 1 === 1 ? otherData.photo : myData.photo}
                      alt="callimage"
                    />
                  ) : (
                    <video
                      className="fixed top-0 left-0 w-screen h-screen z-10 "
                      playsInline
                      muted
                      ref={userVideo}
                      autoPlay
                    />
                  )}
                  {calling === true && callAccepted === false && (
                    <div className="flex flex-col object-center z-20 h-[100%] justify-center items-center">
                      <img
                        className="flex z-20 w-[100px] h-[100px] rounded-full"
                        src={which * 1 === 1 ? otherData.photo : myData.photo}
                        alt="alt"
                      />
                      <p className="pt-5 text-bold z-50">{callStatus}...</p>
                    </div>
                  )}

                  {cameraOn === true && (
                    <video
                      className="absolute bottom-0 w-[200px] h-[200px] right-0 pr-4 pb-4 z-30 "
                      playsInline
                      muted
                      ref={myVideoDuringCall}
                      autoPlay
                    />
                  )}

                  <div className="absolute w-[100%] justify-center flex-row flex gap-4 p-5 bottom-0 z-30">
                    <p
                      onClick={() => setCameraOn(!cameraOn)}
                      className="text-black bg-white z-30 p-1 rounded-full"
                    >
                      {cameraOn ? (
                        <FaVideo size={20} />
                      ) : (
                        <FaVideoSlash size={20} />
                      )}
                    </p>
                    <p
                      onClick={() => setMicrophoneOn(!microphoneOn)}
                      className="text-black bg-white rounded-full p-1 z-30"
                    >
                      {microphoneOn ? (
                        <FaMicrophone size={20} />
                      ) : (
                        <FaMicrophoneSlash size={20} />
                      )}
                    </p>
                    <p
                      onClick={() => setSpeakerOn(!speakerOn)}
                      className="text-black bg-white rounded-full p-1 z-30"
                    >
                      {speakerOn ? (
                        <FaVolumeUp size={20} />
                      ) : (
                        <FaVolumeMute size={20} />
                      )}
                    </p>

                    <p
                      onClick={() => {
                        leaveCall();
                      }}
                      className="text-white bg-red-600 rounded-xl p-1 z-30"
                    >
                      <ImPhoneHangUp size={25} />
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call control buttons */}
      </div>
    </>
  );
}

export default VideoCall;
