const API = "https://api.fanbies.com/okiki/api";
/*
Log In user
*/
export const loginUser = (data) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ ...data }),
    };
    fetch(`${API}/signin`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
Register user
*/
export const registerUser = (data) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ ...data }),
    };
    fetch(`${API}/registeruser`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
Get user profile
*/

export const getUserProfile = (data) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ ...data }),
    };
    fetch(`${API}/getuserprofile`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
Forgotten password email
*/
export const forgottenPassword = (data) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ ...data }),
    };
    fetch(`${API}/forgottenpass`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
Update user password 
*/
export const updatePassword = (data) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ ...data }),
    };
    fetch(`${API}/resetuserpass`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
One time validate reset hash for password reset
*/
export const validateResetHash = (data, abortcontroller) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ ...data }),
      signal: abortcontroller.signal,
    };
    fetch(`${API}/validateresthash`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
Remove user profile picture
*/
export const removeProfilePicture = (token) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ jtoken: token }),
    };

    fetch(`${API}/removeprofilepic`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
Upload user profile picture
*/
export const uploadProfilePicture = (data) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      body: data,
    };
    fetch(`${API}/profilepicupdate`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
Delete user account
*/
export const deleteAccount = (jwtoken, uid) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ jwtoken, uid }),
    };
    fetch(`${API}/deleteuser`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
Get Cookie by name
*/
export const getCookie = (cookieName) => {
  let name;
  if (document.cookie) {
    name = document?.cookie
      .split(";")
      .find((row) => row.startsWith(`${cookieName}=`))
      .split("=")[1];
  }
  return name ?? "";
};

/*
Update user profile
*/
export const updateUserProfile = (data) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ ...data }),
    };
    fetch(`${API}/updatedetails`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
Get App Config Video Message Rates
*/
export const getInAppConfig = (jtoken, name) =>
  new Promise((resolve, reject) => {
    const value = "value";
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ jtoken, name, value }),
    };

    fetch(`${API}/getconfig`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
  Update Request Form 
*/
export const updateRequestForm = (data) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ ...data }),
    };
    fetch(`${API}/updaterequestform`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
 Ask to join Fanbies Request tool
*/
export const askVerifyRequestTool = (jtoken) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ jtoken }),
    };
    fetch(`${API}/verifyrequest`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/**
 * Update Password By User ID updateuserpasswordbyid
 */
export const updateUserPasswordById = (data) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ ...data }),
    };
    fetch(`${API}/updateuserpasswordbyid`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
 Create a custom link
*/
export const createCustomLink = (data) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ ...data }),
    };
    fetch(`${API}/createuserlink`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
 Get all custom links
*/
export const getCustomLinks = (username) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ username }),
    };
    fetch(`${API}/owneredlinks`, params)
      .then((res) => res.json())
      .then((e) => resolve(e?.response))
      .catch((err) => reject(err.message));
  });

/*
 Delete custom link
*/
export const deleteCustomLink = (data) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify({ ...data }),
    };
    fetch(`${API}/deletelink`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
 Update custom link
*/
export const updateCustomLinksItem = (jtoken, item) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ jtoken, item: { ...item } }),
    };
    fetch(`${API}/updatelink`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

/*
 Shoutout Booking
*/
export const bookingShoutoutRequest = (jtoken, item) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ jtoken, ...item }),
    };
    fetch(`${API}/v2/paymentRegister`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });
