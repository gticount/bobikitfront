import { ImageCircle } from './ImageCircle';
import { Link } from 'react-router-dom';
import { handleLogin, retrievedCookieValue } from './utilities';
import { FollowSideComponent } from './sideComponentFollow';
import { useMyContext } from '../alertContext';

const imagepath =
  'https://www.dropbox.com/scl/fi/5c2ew0xbjca0x14a2upv8/e0341dab7619da163adf938cf2d162c9.gif?rlkey=fbrym4zb2yqslxl79lht8axlx&raw=1';

const jwtToken = retrievedCookieValue();
const SideComponenetOfHomePage = ({ me, suggestions }) => {
  const { showAlert } = useMyContext();

  const handleLogout = () => {
    handleLogin({
      url: 'https://bobikit.onrender.com/api/v1/users/logout',
      logout: true,
      jwtToken: jwtToken,
      showAlert,
      header: {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    });
  };
  return (
    <div className="w-full h-[400px] items-center flex-col pl-[15%] hidden xl:block">
      <div className="w-[100%] h-[20px] mx-[0px] my-[0px] flex flex-row mb-4">
        <Link to={`/profile`}>
          <div className="flex items-start cursor-pointer pr-4">
            <ImageCircle
              width={18}
              height={18}
              src={me ? me.smallPhoto : imagepath}
              mb={0}
              borderWidth={0}
            />
          </div>
        </Link>
        <Link to={`/profile`}>
          <div className="flex flex-col cursor-pointer pt-1">
            <p className="hidden lg:block text-xs text-gray-900 font-semibold">
              {me ? me.username : 'username..'}
            </p>
            <p className="hidden lg:block text-xs text-gray-500 font-normal">
              {me ? me.name : 'Full Name'}
            </p>
          </div>
        </Link>
        <div className="flex-grow text-right pr-4 pt-1">
          <p
            onClick={handleLogout}
            className="text-xs cursor-pointer text-gray-700"
          >
            logout
          </p>
        </div>
      </div>

      <div className="w-[100%] mx-[0px] mt-12 mb-8">
        <div className="flex flex-row items-center">
          <p className="text-xs font-medium text-gray-400">Suggested for you</p>
        </div>
      </div>

      {suggestions.slice(0, 7).map((suggestion, index) => (
        <div key={index} className="flex-row w-[100%] mx-[0px] my-2">
          <div className="flex items-start cursor-pointer pr-4">
            <Link to={`/profile/${suggestion.username}`}>
              <ImageCircle
                width={13}
                height={13}
                src={suggestion.smallPhoto}
                mb={0}
                borderWidth={0}
              />
            </Link>
            <Link to={`/profile/${suggestion.username}`}>
              <div className="flex flex-col cursor-pointer pl-2">
                <p className="hidden lg:block text-xs text-gray-900 font-semibold">
                  {suggestion.username}
                </p>
                <p className="hidden lg:block text-xs text-gray-400 font-medium">
                  {suggestion.name}
                </p>
              </div>
            </Link>
            <FollowSideComponent
              suggestion={suggestion._id}
              jwtToken={jwtToken}
              showAlert={showAlert}
            />
          </div>
        </div>
      ))}
      <div className="w-[100%] mx-[0px] my-4">
        <div className="flex flex-row items-center">
          <p className="text-xs font-medium text-gray-400">About</p>
          <p className="text-xs pl-2 font-medium text-gray-400">Help</p>
          <p className="text-xs pl-2 font-medium text-gray-400">Privacy</p>
          <p className="text-xs pl-2 font-medium text-gray-400">Terms</p>
          <p className="text-xs pl-2 font-medium text-gray-400">Motivation</p>
        </div>
      </div>

      <div className="w-[100%] mx-[0px] my-4">
        <div className="flex flex-row items-center">
          <p className="text-xs font-medium text-gray-400">
            &copy; Ankit Singh
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideComponenetOfHomePage;
