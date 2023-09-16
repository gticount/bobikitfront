import axios from 'axios';
import Cookies from 'js-cookie';
import BasicAlerts from './alertComponent/alert';

export function retrievedCookieValue() {
  return Cookies.get('authToken');
}

const SecureCookieSetter = (value) => {
  Cookies.set('authToken', `${value}`, {
    expires: 30,
    secure: true,
  });
};

export function getTime(date) {
  const time = new Date(date);
  const options = {
    month: 'short', // Get the short month name
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false, // Use 24-hour format
  };

  const formattedDate = time.toLocaleString('en-US', options);
  return formattedDate;
}

export async function createMessage({
  firstuser,
  seconduser,
  jwtToken,
  showAlert,
}) {
  try {
    return await axios
      .post(
        'https://bobikit.onrender.com/api/v1/conversations',
        {
          users: [firstuser.toString(), seconduser.toString()],
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => {
        showAlert({
          type: 'success',
          message: 'created a new conversation...',
        });
        return res.data.data;
      })
      .catch((error) => {
        showAlert({
          type: 'error',
          message: 'Couldnt create conversation...',
        });
      });
  } catch (err) {
    showAlert({
      type: 'error',
      message: 'Couldnt create conversation...',
    });
  }
}

export async function sendMessage({
  url,
  requestBody,
  jwtToken,
  showAlert,
  follow,
  mutei,
}) {
  return await axios
    .post(url, requestBody, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json', // Specify the content type of the request
      },
    })
    .then((res) => {
      if (follow) {
        showAlert({
          type: 'success',
          message: 'updated follow status...',
        });
      } else if (mutei) {
        showAlert({
          type: 'success',
          message: 'Mute status updated...',
        });
      } else {
        showAlert({
          type: 'success',
          message: 'Message Sent...',
        });
      }

      return res.data;
    })
    .catch((error) => {
      if (follow) {
        showAlert({
          type: 'error',
          message: 'couldnt update follow status...',
        });
      } else {
        showAlert({
          type: 'error',
          message: 'couldnt send message...',
        });
      }
    });
}

async function updateMessage({ url, jwtToken, showAlert, seen }) {
  return await axios
    .patch(
      url,
      {
        delivered: true,
        seen: seen ? true : false,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      showAlert({
        type: 'success',
        message: 'updated the message status...',
      });
      return res;
    })
    .catch((error) => {
      showAlert({
        type: 'error',
        message: 'couldnt update the message status...',
      });
    });
}

export async function updateMessagehandler({
  messageid,
  jwtToken,
  id,
  showAlert,
  seen,
}) {
  try {
    const res = await updateMessage({
      url: `https://bobikit.onrender.com/api/v1/conversations/${id}/${messageid}?`,
      jwtToken: jwtToken,
      showAlert: showAlert,
      seen,
    });
  } catch (err) {
    showAlert({
      type: 'error',
      message: 'couldnt update the message status...',
    });
  }
}

export async function handleLiker({ type, id, jwtToken, body, showAlert }) {
  if (!body) {
    body = {};
  }
  try {
    axios.post(`https://bobikit.onrender.com/api/v1/${type}/like/${id}`, body, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json', // Specify the content type of the request
      },
    });
  } catch (err) {
    showAlert({
      type: 'error',
      message: 'like couldnt be updated...',
    });
  }
}

export function findCommonElement(arr1, arr2) {
  return arr1.filter((element) => arr2.includes(element));
}

export async function fetchData({ url, jwtToken, showAlert }) {
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
        message: 'error loading data',
      });
    });
}

export function getTimeDifference(at) {
  const createdAt = new Date(at);
  const now = Date.now();
  const differenceInSeconds = Math.floor((now - createdAt) / 1000);

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds} seconds ago`;
  } else if (differenceInSeconds < 3600) {
    const minutes = Math.floor(differenceInSeconds / 60);
    return `${minutes} minutes ago`;
  } else if (differenceInSeconds < 86400) {
    const hours = Math.floor(differenceInSeconds / 3600);
    return `${hours} hours ago`;
  } else {
    const days = Math.floor(differenceInSeconds / 86400);
    return `${days} days ago`;
  }
}

export async function handleLogin({
  body,
  url,
  username,
  password,
  header,
  logout,
  jwtToken,
  showAlert,
}) {
  try {
    let login;
    if (logout) {
      login = await axios
        .get(
          `https://bobikit.onrender.com/api/v1/users/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .then((res) => {
          showAlert({
            type: 'success',
            message: 'successfully logged out..',
          });
          return res;
        })
        .catch((err) => {
          showAlert({
            type: 'error',
            message: 'couldnt logout..',
          });
        });
    } else if (!url) {
      login = await axios
        .post(
          `https://bobikit.onrender.com/api/v1/users/login`,
          body
            ? body
            : {
                username: username,
                password: password,
              },
        )
        .then((res) => {
          showAlert({
            type: 'success',
            message: 'login successfull..',
          });
          return res;
        })
        .catch((err) => {
          showAlert({
            type: 'error',
            message: 'couldnt login..',
          });
        });
    } else {
      login = await axios
        .post(url, body)
        .then((res) => {
          showAlert({
            type: 'success',
            message: 'Created new account..',
          });
          return res;
        })
        .catch((err) => {
          showAlert({
            type: 'error',
            message: 'couldnt create account..',
          });
        });
    }

    const token = login.data.token;
    SecureCookieSetter(token);
    setTimeout(() => {
      if (logout) {
        window.location.href = '/login';
      } else window.location.href = '/';
    }, 2000);
  } catch (error) {
    showAlert({
      type: 'error',
      message: 'couldnt logout..',
    });
  }
}

async function convertDataURLToBlob(dataURL) {
  // Extract base64 data
  const base64Data = dataURL.split(',')[1];

  // Convert base64 to Blob
  const blob = new Blob(
    [Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))],
    { type: 'image/jpeg' },
  );

  return blob;
}

async function convertBlobToFile(blob, fileName, fileType) {
  const file = new File([blob], fileName, { type: fileType });
  return file;
}

export async function dataURItoBlob(dataURL, index) {
  try {
    const blob = await convertDataURLToBlob(dataURL);
    const fileName = `image_${index}.jpg`;
    const fileType = 'image/jpeg';
    const file = await convertBlobToFile(blob, fileName, fileType);
    return file;
  } catch (error) {
    <BasicAlerts message={'Something went wrong'} alerttype={'error'} />;
  }
}

export function formSendingMessage({ id, me, otherUser, type, tosend }) {
  return {
    conversation: `${id}`,
    sender: `${me._id.toString()}`,
    receiver: `${otherUser._id.toString()}`,
    createdAt: new Date(Date.now()),
    type: `${type}`,
    content: `${tosend}`,
    likes: ``,
    delivered: false,
    seen: false,
  };
}

export async function handleCommenting({
  type,
  comment,
  posttoComment,
  me,
  jwtToken,
  showAlert,
}) {
  //const { showAlert } = useMyContext();
  try {
    return await axios
      .post(
        `https://bobikit.onrender.com/api/v1/posts/${type}/${posttoComment}`,
        type === 'comments'
          ? { user: me._id.toString(), post: posttoComment, content: comment }
          : {
              user: me._id.toString(),
              comment: posttoComment,
              content: comment,
            },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => {
        showAlert({
          type: 'success',
          message: 'comment posted...',
        });
        return res;
      });
  } catch (err) {
    showAlert({
      type: 'error',
      message: 'couldnt post comment...',
    });
  }
}

export async function handleDeleting({ type, id, jwtToken, showAlert }) {
  try {
    return await axios
      .delete(`https://bobikit.onrender.com/api/v1/${type}/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        showAlert({
          type: 'success',
          message: 'deleted...',
        });
      })
      .catch((err) => {
        showAlert({
          type: 'error',
          message: 'couldnt delete...',
        });
      });
  } catch (err) {
    showAlert({
      type: 'error',
      message: 'couldnt delete...',
    });
  }
}
