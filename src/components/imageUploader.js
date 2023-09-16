import React, { useEffect, useState } from 'react';
import { ImageCircle } from './ImageCircle';
import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CanvasComponent from './canvasComponent';
import axios from 'axios';
import { retrievedCookieValue } from './utilities';
import Spinner from './Spinner';
import Animation from './alertComponent/controlAnimation';
import animationData from '../animations/uploadAnimation.json';

export function ImageUploader({ refer, me }) {
  const [selectedOption, setSelectedOption] = useState('post');
  const [numImages, setNumImages] = useState(1);
  const [editing, setEditing] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const [editedImages, setEditedImages] = useState([]);
  const [currentAction, setCurrentAction] = useState(false);
  const [editingIndex, setEditingIndex] = useState(0);
  const [submitbutton, setSubmitButton] = useState(false);
  const [caption, setCaption] = useState('');
  const lottieRef = React.createRef();

  const navigate = useNavigate();

  useEffect(() => {
    if (currentAction === 'next' && editingIndex >= uploadedImages.length - 1) {
      setSubmitButton(true);
      setCurrentAction(null);
    } else if (currentAction === 'next') {
      setEditingIndex(editingIndex + 1);
      setCurrentAction(null);
    }
  }, [currentAction]);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const newImages = Array.from(files);
    setUploadedImages(newImages);
  };

  const handleMusicUploads = (e, index) => {
    const file = e.target.files[0];
    const modifiedFile = new File([file], `audio-${index}`, {
      type: e.target.files[0].type,
    });
    setUploadedSongs((prev) => [...prev, modifiedFile]);
  };

  const handleProceed = () => {
    setEditing(true);
  };

  const handleSubmit = (jwtToken) => {
    lottieRef.current.setSpeed(0.5);

    lottieRef.current.playSegments([11, 44], true);
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'multipart/form-data',
    };

    if (selectedOption === 'post') {
      const formDataImage = new FormData();
      const formDataAudio = new FormData();

      editedImages.forEach((el) => {
        formDataImage.append(`image`, el);
      });

      uploadedSongs.forEach((el) => {
        formDataAudio.append(`audio`, el);
      });

      axios
        .post(
          'https://bobikit.onrender.com/api/v1/posts',
          {
            caption: caption,
            user: me._id.toString(),
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json', // Specify the content type of the request
            },
          },
        )
        .then((response) => {
          lottieRef.current.pause();
          lottieRef.current.setSpeed(0.3);
          lottieRef.current.playSegments([44, 64], false);
          axios
            .post(
              `https://bobikit.onrender.com/api/v1/users/createUploadPostImages/${response.data.data.doc._id.toString()}`,
              formDataImage,
              {
                headers,
              },
            )
            .then((res) => {
              lottieRef.current.pause();
              lottieRef.current.playSegments([64, 77], false);
              axios
                .post(
                  `https://bobikit.onrender.com/api/v1/users/createUploadPostAudios/${response.data.data.doc._id.toString()}`,
                  formDataAudio,
                  {
                    headers,
                  },
                )
                .then((resi) => {
                  lottieRef.current.setSpeed(1.5);
                  lottieRef.current.playSegments([77, 139], true);

                  setTimeout(() => {
                    navigate('/profile');
                  }, 500);
                })
                .catch((erri) => {
                  lottieRef.current.stop();

                  setTimeout(() => {
                    navigate('/create');
                  }, 500);
                });
            })
            .catch((err) => {
              console.error('Upload error:', err);
            });
        })
        .catch((error) => {
          console.log('error', error);
        });
    } else {
      const formDataImage = new FormData();
      const formDataAudio = new FormData();

      formDataImage.append(`image`, editedImages[0]);

      formDataAudio.append(`audio`, uploadedSongs[0]);

      axios
        .post(
          'https://bobikit.onrender.com/api/v1/stories',
          { user: me._id.toString() },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json', // Specify the content type of the request
            },
          },
        )
        .then((response) => {
          axios
            .post(
              `https://bobikit.onrender.com/api/v1/users/createUploadStoryImage/${response.data.data.doc._id.toString()}`,
              formDataImage,
              {
                headers,
              },
            )
            .then((response) => {
              console.log('Upload success:', response.data);
            })
            .catch((error) => {
              console.error('Upload error:', error);
            });

          axios
            .post(
              `https://bobikit.onrender.com/api/v1/users/createUploadStoryAudio/${response.data.data.doc._id.toString()}`,
              formDataAudio,
              {
                headers,
              },
            )
            .then((response) => {
              console.log('Upload success:', response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log('error', err);
        });
    }
  };

  return (
    <div className="fixed top-0 right-0 w-screen h-screen flex flex-col justify-start items-end z-40 bg-black bg-opacity-70 p-4 mb-8">
      <div className="z-50 ">
        <div className="flex justify-center items-center w-full h-screen">
          <div className="absolute inset-[10rem] bg-lightgray flex justify-center items-center">
            <div
              className="bg-white w-[70rem] h-[100vh] overflow-hidden flex flex-col"
              ref={refer}
            >
              {!editing ? (
                <>
                  <div className="flex justify-center items-center p-2">
                    <label className="mr-2">Create:</label>
                    <select
                      value={selectedOption}
                      onChange={(e) => {
                        setSelectedOption(e.target.value);
                      }}
                    >
                      <option value="post">Post</option>
                      <option value="story">Story</option>
                    </select>
                  </div>

                  {/* Conditional content based on selected option */}
                  {selectedOption === 'story' && (
                    <div>
                      <div className="mb-4">
                        {/* Upload option for image */}
                        <label className="text-[rgba(130,176,77,255)] px-2">
                          Upload Image:
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="bg-[rgba(130,176,77,255)]"
                          onChange={(e) => handleImageUpload(e)}
                        />
                      </div>
                      <div className="pl-2">
                        {/* Upload option for music */}
                        <input
                          className="pl-2 ring-1 ring-[rgba(130,176,77,255)] focus:outline-none"
                          type="file"
                          accept="audio/mpeg"
                          placeholder="Search audio file"
                          onChange={(e) => handleMusicUploads(e, 0)}
                        />
                      </div>
                    </div>
                  )}

                  {selectedOption === 'post' && (
                    <div>
                      {/* Upload options for images */}
                      <div className="mb-4">
                        <label className="text-[rgba(130,176,77,255)] px-2">
                          Upload Images:
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            setNumImages(e.target.files.length);
                            handleImageUpload(e);
                          }}
                          className="bg-[rgba(130,176,77,255)]"
                        />
                      </div>

                      <div className="mb-4">
                        <input
                          className="pl-2 focus:outline-none ring-1 ring-[rgba(130,176,77,255)]"
                          type="text"
                          onChange={(e) => setCaption(e.target.value)}
                        />
                      </div>

                      {/* Display audio input options based on number of images */}
                      {Array.from({ length: numImages }).map((_, index) => (
                        <div key={index} className="pl-2 pb-2">
                          <input
                            className="pl-2 ring-1 ring-[rgba(130,176,77,255)] focus:outline-none"
                            type="file"
                            accept="audio/mpeg"
                            onChange={(e) => handleMusicUploads(e, index)}
                          />
                          <label className="pl-2">{`post: ${index}`}</label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Spacer to push content to top */}
                  <div className="flex-grow" />

                  {/* Button at the bottom */}
                  <div className="flex justify-center items-center p-4">
                    <button
                      onClick={() => handleProceed()}
                      className="bg-black w-[20%] h-[100%] ring-2 ring-[rgba(130,176,77,255)] text-white"
                    >
                      Proceed
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {submitbutton && (
                    <div className="px-[45%] pt-[30%]">
                      <Animation
                        lottieRef={lottieRef}
                        animationData={animationData}
                      />
                    </div>
                  )}
                  <div className="flex-grow" />
                  {submitbutton && (
                    <div className="flex">
                      <div className="flex-grow"></div>
                      <button
                        onClick={() => {
                          const jwtToken = retrievedCookieValue();
                          handleSubmit(jwtToken);
                        }}
                        className={` text-white ring-2 ring-[rgba(130,176,77,255)] bg-black`}
                      >
                        {lottieRef.current &&
                        lottieRef.current.getDuration(true) > 11
                          ? 'uploading...'
                          : lottieRef.current &&
                            lottieRef.current.getDuration(true) > 130
                          ? 'done'
                          : 'submit'}{' '}
                      </button>
                      <div className="flex-grow"></div>
                    </div>
                  )}
                  {!submitbutton && uploadedImages[editingIndex] && (
                    <CanvasComponent
                      editingIndex={editingIndex}
                      uploadedImages={uploadedImages}
                      setCurrentAction={setCurrentAction}
                      setEditedImages={setEditedImages}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
