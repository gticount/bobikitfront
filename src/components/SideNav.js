import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AiOutlineMenu,
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineMessage,
  AiOutlineFire,
  AiOutlinePlusCircle,
  AiOutlineSetting,
  AiOutlineWarning,
  AiOutlinePoweroff,
} from 'react-icons/ai';

import { ImageCircle } from './ImageCircle';
import Spinner from './Spinner';

import { Messages } from './Messages';
import { Link } from 'react-router-dom';
import { RecentSearches } from './RecentSearches';
import SearchPlaceholder from '../placeholders/searcPlaceholder';
import { retrievedCookieValue } from './utilities';
import { useMyContext } from '../alertContext';

const buttonTrueCss =
  'font-bold text-gray-800 cursor-pointer mb-10 rounded-[10px] flex flex-row items-center ';
const buttonFalseCss =
  'hover:font-semibold hover:text-gray-700 text-gray-600 font-normal cursor-pointer mb-10 rounded-[10px] flex flex-row items-center ';

const SideNav = ({ imagepath, me }) => {
  const { showAlert } = useMyContext();
  const { section, id } = useParams();
  const [activebutton, setActiveButton] = useState(!section ? 'home' : section);
  const [messageList, setMessageList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchList, setSearchList] = useState([]);
  const [recentSearch, setRecentSearch] = useState([]);
  const [searchBar, setSearchBar] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleButtonClick = (value) => {
    setSearchBar(false);
    setActiveButton(value);
  };

  useEffect(() => {
    setActiveButton(!section ? 'home' : section);
  }, [section]);

  useEffect(() => {
    if (searchBar) {
      fetchData('https://bobikit.onrender.com/api/v1/users/recentSearch').then(
        (res) => setRecentSearch(res.doc.recentSearches),
      );
    }
  }, [searchBar]);

  const FindSearch = async (searchquery) => {
    try {
      const res = await axios.get(
        `https://bobikit.onrender.com/api/v1/users/search/${searchquery}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json', // Specify the content type of the request
          },
        },
      );
      const users = res.data.data.doc;
      setSearchList(users);
    } catch (err) {
      showAlert({
        type: 'error',
        message: 'couldnt do search',
      });
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (inputValue !== '') {
      FindSearch(inputValue);
      setSearching(true);
    }
    setSearchList([]);
  }, [inputValue]);

  const [menu, setMenu] = useState(false);
  const jwtToken = retrievedCookieValue();
  const fetchData = async (url) => {
    try {
      return await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        .then((res) => res.data.data)
        .catch((error) => {
          showAlert({
            type: 'error',
            message: 'couldnt find',
          });
        });
    } catch (err) {
      showAlert({
        type: 'error',
        message: 'couldnt find',
      });
    }
  };

  useEffect(() => {
    if (section === 'message') {
      try {
        fetchData(
          'https://bobikit.onrender.com/api/v1/conversations',
          jwtToken,
        ).then((res) => {
          setMessageList(res.doc);
          console.log(' message list ', res.doc);
        });
      } catch (err) {
        showAlert({
          type: 'error',
          message: 'couldnt find',
        });
      }
    } else {
      setMessageList([]);
    }
  }, [section]);

  return (
    <div className="items-start flex-col">
      <div className="mx-auto my-auto flex items-start flex-col p-4">
        <div
          className={'border-r'} // Apply the border styles to this inner div
          style={{
            borderRight: '1px solid rgba(210, 210, 210, 1)',
            paddingRight: '10px',
          }}
        >
          <h4 className="cursor-pointer text-base sm:text-base lg:text-xl mb-10 font-sans max-w-md pt-8">
            {!['message', 'notification'].includes(activebutton) &&
              !searchBar && (
                <img
                  src={
                    'https://www.dropbox.com/scl/fi/ds1g92nrplhtd1p9azsex/Bobikit-removebg-preview.png?rlkey=rmu9pyyrdqdf565nsb6dirs99&raw=1'
                  }
                  alt="img"
                  className="w-full h-full object-cover rounded-[20px]"
                  style={{ width: `${20 * 3}px`, height: `${20 * 3}px` }}
                />
              )}
          </h4>
          <div className="flex flex-col items-start">
            <div
              onClick={() => handleButtonClick('home')}
              className={
                activebutton === 'home' && !searchBar
                  ? buttonTrueCss
                  : buttonFalseCss
              }
            >
              <Link to="/" className="flex">
                <div className="mr-2 flex items-center">
                  <AiOutlineHome size={25} />
                </div>
                {!['message', 'notification'].includes(activebutton) &&
                  !searchBar && <p className="hidden lg:block">Home</p>}
              </Link>
            </div>
            <div
              onClick={() => setSearchBar(!searchBar)}
              className={searchBar ? buttonTrueCss : buttonFalseCss}
            >
              <div className="mr-2 flex items-center">
                <AiOutlineSearch size={25} />
              </div>
              {!['message', 'notification'].includes(activebutton) &&
                !searchBar && <p className="hidden lg:block">Search</p>}
            </div>
            <div
              onClick={() => handleButtonClick('message')}
              className={
                activebutton === 'message' ? buttonTrueCss : buttonFalseCss
              }
            >
              <Link to="/message" className="flex">
                <div className="mr-2 flex items-center">
                  <AiOutlineMessage size={25} />
                </div>
                {!['message', 'notification'].includes(activebutton) &&
                  !searchBar && <p className="hidden lg:block">Message</p>}
              </Link>
            </div>
            <div
              onClick={() => handleButtonClick('notification')}
              className={
                activebutton === 'notification' ? buttonTrueCss : buttonFalseCss
              }
            >
              <div className="mr-2 flex items-center">
                <AiOutlineFire size={25} />
              </div>
              {!['message', 'notification'].includes(activebutton) &&
                !searchBar && <p className="hidden lg:block">Notifications</p>}
            </div>
            <div
              onClick={() => handleButtonClick('create')}
              className={
                activebutton === 'create' ? buttonTrueCss : buttonFalseCss
              }
            >
              <Link to="/create" className="flex">
                <div className="mr-2 flex items-center">
                  <AiOutlinePlusCircle size={25} />
                </div>
                {!['message', 'notification'].includes(activebutton) &&
                  !searchBar && <p className="hidden lg:block">Create</p>}
              </Link>
            </div>
            <div
              onClick={() => handleButtonClick('profile')}
              className={
                activebutton === 'profile' && !id
                  ? buttonTrueCss
                  : buttonFalseCss
              }
            >
              <Link to="/profile" className="flex">
                <div className="mr-2 flex items-center">
                  <ImageCircle
                    width={13}
                    height={13}
                    src={imagepath}
                    mb={0}
                    borderWidth={2}
                  />
                </div>
                {!['message', 'notification'].includes(activebutton) &&
                  !searchBar && <p className="hidden lg:block">Profile</p>}
              </Link>
            </div>
          </div>
          <div
            className="hover:font-semibold text-gray-600 font-normal cursor-pointer mt-10"
            onClick={() => setMenu(!menu)}
          >
            <AiOutlineMenu size={25} />
          </div>
        </div>
      </div>
      {/*{searchBar ? (
        <div className="bg-white/80 fixed w-full h-screen z-10 top-0 left-[9.5%]"></div>
      ) : (
        ''
      )}*/}

      <div
        className={
          searchBar
            ? 'fixed top-0 left-[5.5%] w-[300px] h-screen bg-white bg-opacity-95 z-40 duration-[600ms]'
            : 'fixed top-0 left-[-100%] w-[300px] h-screen bg-white bg-opacity-95 border-r z-40 duration-[2000ms]'
        }
        style={{
          borderRight: searchBar ? '1px solid rgba(210, 210, 210, 1)' : 'none',
        }}
      >
        <div className="flex-col">
          <h2 className="flex items-start mx-auto my-auto pt-4 pb-5">Search</h2>
          <div className="flex relative">
            <input
              type="text"
              className="block w-full px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded focus:outline-none"
              placeholder="Enter the username..."
              onChange={(e) => setInputValue(e.target.value)}
            />
            {searching && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Spinner />
              </div>
            )}
          </div>

          <div className="flex flex-row items-center justify-between pt-20">
            <span className="flex items-start">recent</span>
            <span className="flex items-end pr-10">clear all</span>
          </div>

          <div className="max-h-[600px]">
            {searching && (
              <div className="grid grid-cols-1 gap-2">
                <SearchPlaceholder />
                <SearchPlaceholder />
                <SearchPlaceholder />
                <SearchPlaceholder />
                <SearchPlaceholder />
                <SearchPlaceholder />
                <SearchPlaceholder />
                <SearchPlaceholder />
              </div>
            )}
            {!searching &&
              (searchList.length > 0 ? (
                <RecentSearches
                  users={searchList}
                  index={'search'}
                  me={me}
                  pata={recentSearch}
                />
              ) : recentSearch.length > 0 ? (
                <RecentSearches users={recentSearch} index={'recent'} me={me} />
              ) : (
                ''
              ))}
          </div>
        </div>
      </div>

      {/*hello jlkdjslkfjsdlkfjklsdj lkjfkla*/}
      <div
        className={
          activebutton === 'message'
            ? 'fixed top-0 left-[5.5%] w-[300px] overflow-auto h-screen bg-white bg-opacity-95 z-30 duration-[600ms]'
            : 'fixed top-0 left-[-100%] w-[300px] overflow-auto h-screen bg-white bg-opacity-95 border-r z-30 duration-[2000ms]'
        }
        style={{
          borderRight: '1px solid rgba(210, 210, 210, 1)',
        }}
      >
        <div className="flex-col">
          <h2 className="flex items-start mx-auto my-auto pt-4 pb-5 font-bold">
            {me.username}
          </h2>
          <div className="flex flex-row">
            <h3 className="text-left flex font-semibold"> Messages </h3>
            <h4 className="font-normal text-sm pl-[55%]"> request </h4>
          </div>
          <div className="flex flex-row items-center justify-between pt-2">
            {messageList.length > 0 ? (
              <Messages users={messageList} />
            ) : (
              <div className="grid grid-cols-1 gap-2 pt-8">
                <SearchPlaceholder />
                <SearchPlaceholder />
                <SearchPlaceholder />
                <SearchPlaceholder />
                <SearchPlaceholder />
                <SearchPlaceholder />
                <SearchPlaceholder />
                <SearchPlaceholder />
              </div>
            )}
          </div>
        </div>
      </div>

      {/*




*/}
      <div
        className={
          menu
            ? 'fixed bottom-[20%] left-[2.5%] h-[18%] w-[200px] text-gray-600 font-semibold text-sm  bg-white bg-opacity-95 z-10 duration-[600ms]'
            : 'fixed bottom-0 left-[-100%] h-[-100%] w-[-100%] bg-white bg-opacity-95 border-r z-10 duration-[2000ms]'
        }
        style={{
          border: menu ? '1px solid rgba(255,102,196,1)' : 'none',
        }}
      >
        <div className="flex-col">
          <Link to="/settings">
            <div className="flex flex-row items-center mb-5 pt-4 pl-4">
              <AiOutlineSetting size={15} />
              <span className="flex pl-5">Settings</span>
            </div>
          </Link>
          <div className="flex flex-row items-center mb-5 pl-4">
            <AiOutlineWarning size={15} />
            <span className="flex pl-5">Report issue</span>
          </div>
          <div className="flex flex-row items-center pl-4">
            <AiOutlinePoweroff size={15} />
            <span className="flex pl-5">logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
