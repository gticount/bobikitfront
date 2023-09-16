import React, { useEffect, useState, useRef, createRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideNav from './components/SideNav';
import Stories from './components/Stories';
import PostFeed from './components/PostFeed';
import SideComponenetOfHomePage from './components/sideComponentOfHomePage';
import { Profile } from './components/Profile';
import axios from 'axios';
import Spinner from './components/Spinner';
import PostOverlay from './components/PostOverlay';
import useOutsideClick from './overlayHook';
import StoryOverlay from './components/StoryOverlay';
import { Conversation } from './components/Conversation';
import FeedHolder from './placeholders/FeedPlaceholder';
import SearchPlaceholder from './placeholders/searcPlaceholder';
import ProfileHolder from './placeholders/profilePlaceholder';
import {
  retrievedCookieValue,
  updateMessagehandler,
} from './components/utilities';
import { ImageUploader } from './components/imageUploader';
import Animation from './components/alertComponent/controlAnimation';
import animationData from './animations/call.json';
import { useSocket } from './MyContext';
import { useMyContext } from './alertContext';
import UserProfileSettings from './Settings';
import BasicAlerts from './components/alertComponent/alert';

let content;
let sidinavi;

const HomePage = () => {
  const socket = useSocket();
  const { section, id, index, clicked, showbutton } = useParams();
  const [feed, setFeed] = useState([]);
  const [story, setStory] = useState([]);
  let done = 0;
  const [me, setMe] = useState([]);
  const [suggestions, setSuggestion] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [myStory, setMyStory] = useState([]);
  const [otherUserProfile, setOtherUserProfile] = useState([]);
  const [showPost, setShowPost] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [eachPost, setEachPost] = useState(null);
  const [pageNumberOfFeed, setPageNumberOfFeed] = useState(1);
  const [feedFeed, setFeedFeed] = useState(false);
  const [nosuggestion, setNoSuggestion] = useState(false);
  const { showAlert } = useMyContext();

  const [callReceiving, setCallReceiving] = useState(false);
  const [caller, setCaller] = useState([]);
  const [callerid, setcallerid] = useState(null);
  const [seenData, setSeenData] = useState([]);
  const [doihaveStory, setDoihaveStory] = useState(false);

  const postOverlayRef = useRef(null);
  const storyOverlayRef = useRef(null);
  const callaudioRef = useRef(null);
  const createOverlayRef = useRef(null);

  // Attach the outside click handler
  const navigate = useNavigate();

  useOutsideClick(postOverlayRef, () => {
    setShowPost(false);
    navigate(-1);
  });
  useOutsideClick(storyOverlayRef, () => {
    setShowStory(false);
    navigate(-1);
  });
  useOutsideClick(createOverlayRef, () => {
    navigate(-1);
  });

  useEffect(() => {
    socket.on('callUser', (data) => {
      setCallReceiving(true);
      if (!callerid) setcallerid(data.from);
      if (callaudioRef.current.paused) {
        callaudioRef.current.play().then(async () => {
          localStorage.setItem('callerSignal', JSON.stringify(data.signal));

          if (!caller._id) {
            try {
              const res = await fetchData(
                `https://bobikit.onrender.com/api/v1/users/${data.username}`,
              );

              setCaller(res.user);
              showAlert({
                type: 'info',
                message: `getting a call from ${res.user.name}`,
              });
            } catch (err) {
              showAlert({
                type: 'error',
                message: 'couldnt find the caller',
              });
            }
          }
        });
      }
      // Set the object as a cookie (serialize it to JSON)
    });
    socket.on('messageReceived', async (data) => {
      try {
        const res = await updateMessagehandler({
          messageid: data.message._id.toString(),
          jwtToken: jwtToken,
          id: data.conversation.toString(),
          showAlert: showAlert,
          seen: false,
        });
        socket.emit('delivered', {
          from: socket.id,
          userToMessage: data.from,
          message: data.message,
        });
      } catch (err) {
        showAlert({
          type: 'info',
          message: `${data.user.name} sent you a message... `,
        });
      }
    });

    if (!id) {
      socket.on('okReact', (data) => {
        showAlert({
          type: 'info',
          message: `${data.user} reacted ${data.react} to your message`,
        });
      });
    }
  }, [socket]);

  const fetchData = async (url) => {
    return await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((res) => {
        if (res.status === 401) {
          navigate('/login');
        }
        return res.data.data;
        //return res.data.data;
      })
      .catch((error) => {
        showAlert({
          type: 'error',
          message: 'Something went wrong...',
        });
      });
  };
  const jwtToken = retrievedCookieValue();
  if (!jwtToken || jwtToken === 'loggedout') {
    navigate('/login');
  }

  useEffect(() => {
    if (me._id) {
      if (!done) {
        socket.emit('identifyUser', { userId: me._id.toString() });
        done += 1;
      }

      sidinavi = (
        <SideNav
          imagepath={
            me
              ? me.smallPhoto
              : 'https://www.dropbox.com/scl/fi/3ov27e1679vea2d7auvwd/user.png?rlkey=k78rb7hpdqqawetzye1mpijjw&raw=1'
          }
          me={me}
          socket={socket}
        />
      );
    }
  }, [me]);

  useEffect(() => {
    try {
      if (section !== 'story') {
        setShowStory(false);
        setEachPost([]);
      }
      if (!me._id) {
        fetchData('https://bobikit.onrender.com/api/v1/users/me').then(
          (res) => {
            try {
              setMe(res.user);
              socket.emit('identifyUser', { userId: res.user._id.toString() });
            } catch (err) {
              showAlert({
                type: 'error',
                message: 'Something went wrong...',
              });
            }
          },
        );
      }
      if (!section) {
        if (feed.length === 0) {
          fetchData(
            `https://bobikit.onrender.com/api/v1/posts?page=${pageNumberOfFeed}&limit=${20}&sort=-createdAt`,
          ).then((res) => {
            try {
              setFeed(res.doc);
              setFeedFeed(true);
            } catch (err) {
              showAlert({
                type: 'error',
                message: 'Something went wrong...',
              });
            }
          });
        }

        if (story.length === 0) {
          fetchData('https://bobikit.onrender.com/api/v1/stories').then(
            (res) => {
              try {
                setStory(res.doc);
              } catch (err) {
                showAlert({
                  type: 'error',
                  message: 'Something went wrong...',
                });
              }
            },
          );
        }

        if (suggestions.length === 0) {
          fetchData(
            'https://bobikit.onrender.com/api/v1/users/findsuggestions',
          ).then((res) => {
            try {
              setSuggestion(res.suggestions);
              if (!res.suggestions.length) {
                setNoSuggestion(true);
              }
            } catch (err) {
              showAlert({
                type: 'error',
                message: 'Something went wrong...',
              });
            }
          });
        }
      } else if (section === 'profile' && !id) {
        fetchData('https://bobikit.onrender.com/api/v1/users/findPosts').then(
          (res) => {
            try {
              setMyPosts(res.posts);
            } catch (err) {
              showAlert({
                type: 'error',
                message: 'Something went wrong...',
              });
            }
          },
        );
        fetchData('https://bobikit.onrender.com/api/v1/users/findStories').then(
          (res) => {
            try {
              setMyStory(res.doc);
            } catch (err) {
              showAlert({
                type: 'error',
                message: 'Something went wrong...',
              });
            }
          },
        );
      } else if (section === 'profile' && id) {
        fetchData(`https://bobikit.onrender.com/api/v1/users/${id}`).then(
          (res) => {
            try {
              setOtherUserProfile(res.user);
            } catch (err) {
              showAlert({
                type: 'error',
                message: 'Something went wrong...',
              });
            }
          },
        );
        fetchData(
          `https://bobikit.onrender.com/api/v1/users/findPosts/${id}`,
        ).then((res) => {
          try {
            setMyPosts(res.posts);
          } catch (err) {
            showAlert({
              type: 'error',
              message: 'Something went wrong...',
            });
          }
        });
      } else if (section === 'post' && id) {
        setShowPost(true);
        fetchData(`https://bobikit.onrender.com/api/v1/posts/${id}`).then(
          (res) => {
            try {
              setEachPost(res.doc);
            } catch (err) {
              showAlert({
                type: 'error',
                message: 'Something went wrong...',
              });
            }
          },
        );
      } else if (section === 'story' && id) {
        setShowStory(true);
      }
      if (section !== 'profile') {
        setOtherUserProfile([]);
        setMyStory([]);
      }
      if (section !== 'story') {
        setShowStory(false);
      }
    } catch (err) {
      showAlert({
        type: 'error',
        message: 'Something went wrong...',
      });
    }
  }, [section, id, me, feed, suggestions]);

  useEffect(() => {
    if (
      story.length > 0 &&
      me._id &&
      !seenData.length &&
      story[0].user._id.toString() === me._id.toString()
    ) {
      const list = story[0].stories.map((storyItem) => storyItem.seen);
      setDoihaveStory(true);
      try {
        axios
          .post(
            `https://bobikit.onrender.com/api/v1/users/findSeen`,
            { users: list },
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
              },
            },
          )
          .then((res) => {
            setSeenData(res.data.data);
          })
          .catch((err) => {
            const er = err;
          });
      } catch (err) {
        const er = err;
      }
      setSeenData(list);
    }
  }, [story, me]);

  useEffect(() => {
    if (showPost || showStory) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = 'auto'; // Enable scrolling
    }

    return () => {
      document.body.style.overflow = 'auto'; // Re-enable scrolling on component unmount
    };
  }, [showPost, showStory]);

  if (section === 'post' || section === 'story' || section === 'create') {
  } else if (section === 'profile' && id && me._id) {
    content = (
      <div className="flex w-[100%]">
        {section === 'profile' && me._id && (
          <div className="relative w-[80%] ml-[15%] flex flex-col items-center justify-center">
            <div className="w-full  flex my-[3%] mr-[3%]">
              {otherUserProfile._id ? (
                <Profile
                  sizes={50}
                  me={otherUserProfile}
                  posts={myPosts}
                  myprofile={false}
                  otherUserProfile={me}
                />
              ) : (
                <ProfileHolder />
              )}
            </div>
          </div>
        )}
      </div>
    );
  } else if (section === 'profile' && !id && me._id) {
    content = (
      <div className="flex w-[100%]">
        {section === 'profile' && me._id && (
          <div className="relative w-[80%] ml-[15%] flex flex-col items-center justify-center">
            <div className="w-full  flex my-[3%] mr-[3%]">
              {me._id ? (
                <Profile
                  sizes={50}
                  me={me}
                  posts={myPosts}
                  story={myStory}
                  myprofile={true}
                />
              ) : (
                <ProfileHolder />
              )}
            </div>
          </div>
        )}
      </div>
    );
  } else if (section === 'message' && me._id) {
    if (!id) {
      content = (
        <div>
          {callReceiving === false && (
            <div className="inset-0 w-[110%] z-10 pl-[40%] pt-[30%] justify-center">
              <button className="bg-[rgba(130,176,77,255)] text-white">
                Create message
              </button>
            </div>
          )}
          {callReceiving === true && caller._id ? (
            <div className="pt-[10%]">
              <div className=" flex  objet-right justify-center">
                <img
                  src={caller.photo}
                  className="w-[200px] h-[200px] rounded-full"
                  alt="caller ima"
                />
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  navigate(
                    `/call/${caller.username}/${callerid}/${me.username}/${socket.id}/2`,
                  );
                }}
                className=" flex  objet-right justify-center"
              >
                <Animation
                  autoplay={true}
                  loop={true}
                  animationData={animationData}
                  sizes={10}
                />
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      );
    } else {
      content = (
        <div className="inset-0 w-[110%] z-10">
          <Conversation sizes={12} limit={20} me={me} socket={socket} />
        </div>
      );
    }
  } else if (section === 'settings' && me._id) {
    content = <UserProfileSettings me={me} />;
  } else {
    content = (
      <div className="flex w-[100%] ">
        {!section && (
          <div className="inset-0 w-[75%] z-10">
            <div className="flex flex-col items-center">
              <div className="flex my-[4.5%]">
                {story.length > 0 && me._id ? (
                  <Stories
                    slides={story}
                    sizes={21}
                    limit={8}
                    highlights={false}
                  />
                ) : (
                  <Spinner />
                )}
              </div>
              <div className="flex flex-col md:w-[75%] xl:w-[50%] lg:w-[65%] overflow-hidden">
                {feed.length === 0 && me._id && (
                  <div className="grid grid-cols-1 gap-2">
                    <FeedHolder />
                  </div>
                )}
                {feed.length > 0 && me._id ? (
                  feed.map((post, index) => (
                    <PostFeed key={index} post={post} me={me} />
                  ))
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </div>
        )}
        {!section && (
          <div className="hidden xl:block absolute inset-y-0 right-4 w-[22%] my-[4%] z-10">
            {suggestions.length > 0 && me._id ? (
              <SideComponenetOfHomePage me={me} suggestions={suggestions} />
            ) : (
              !nosuggestion && (
                <div className="grid grid-cols-1 gap-2">
                  <SearchPlaceholder />
                  <SearchPlaceholder />
                  <SearchPlaceholder />
                  <SearchPlaceholder />
                  <SearchPlaceholder />
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  function isAtBottom() {
    if (
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.scrollHeight
    ) {
      return true;
    }
    return false;
  }

  // Function to handle scrolling event
  async function handleScroll() {
    try {
      if (isAtBottom()) {
        if (window.removeEventListener)
          window.removeEventListener('scroll', () => true);
        fetchData(
          `https://bobikit.onrender.com/api/v1/posts?page=${
            pageNumberOfFeed + 1
          }&limit=${5}&sort=-createdAt`,
        ).then((res) => {
          if (res.doc.length > 0) {
            setFeed([...feed, ...res.doc]);
          }
        });
      }
    } catch (err) {
      <BasicAlerts message={'Error loading more data'} alerttype={'warning'} />;
    } finally {
      window.addEventListener('scroll', handleScroll);
      setPageNumberOfFeed((pg) => pg + 1);
      setFeedFeed(true);
    }
  }

  useEffect(() => {
    if (feedFeed) window.addEventListener('scroll', handleScroll);
  }, [feedFeed]);

  return (
    <div className="flex justify-center overflow-x-hidden">
      <audio ref={callaudioRef} loop controls preload="auto" className="hidden">
        <source
          src="https://www.dropbox.com/scl/fi/asi0wsrxqcdgf8hpoquov/call.mp3?rlkey=jrru76gij8xb2upe9wqd2kf3z&raw=1"
          type="audio/mpeg"
        />
      </audio>
      <div
        onClick={() => setShowPost(false)}
        className={`w-[15%] h-screen fixed top-0 left-0 flex-col z-10`}
      >
        {sidinavi}
      </div>
      <div
        className="w-[12%] relative"
        style={{ borderRight: '0px solid #ccc' }}
        onClick={() => setShowPost(false)}
      ></div>
      {section === 'post' && me._id && eachPost._id && id && (
        <div className="fixed top-0 right-0 w-screen h-screen flex flex-col justify-start items-end z-40 bg-black bg-opacity-50 p-4 mb-8">
          <div className="z-50 " ref={postOverlayRef}>
            {eachPost && eachPost._id && me._id ? (
              <PostOverlay
                index={index}
                post={eachPost}
                clicked={clicked}
                showbutton={showbutton}
                me={me}
              />
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      )}
      {showStory &&
      me._id &&
      story &&
      story[id] &&
      (doihaveStory ? seenData.length > 0 : true) ? (
        id ? (
          <div className="fixed top-0 right-0 w-screen h-screen flex flex-col justify-start items-end z-40 bg-black bg-opacity-70 p-4 mb-8">
            <div className="z-40 " ref={storyOverlayRef}>
              <StoryOverlay
                story={story[id]}
                me={me}
                showStory={showStory}
                setShowStory={setShowStory}
                navigate={navigate}
                index={index}
                seenData={seenData}
              />
            </div>
          </div>
        ) : (
          <FeedHolder />
        )
      ) : (
        ''
      )}

      {section === 'create' && me._id && (
        <ImageUploader me={me} refer={createOverlayRef} />
      )}
      <div
        className={`w-[73%] ${showPost || showStory ? 'overlay-active' : ''}`}
        onClick={() => {
          setShowPost(false);
          setShowStory(false);
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default HomePage;
