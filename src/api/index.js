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
      mode: "cors",
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
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ ...data }),
    };
    fetch(`${API}/getprofile`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });
