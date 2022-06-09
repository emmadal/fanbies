/* eslint-disable import/prefer-default-export */
const API_URL = "https://api.fanbies.com/okiki/api";

/*
Log In user
*/
const loginUser = (data) =>
  new Promise((resolve, reject) => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ ...data }),
    };
    fetch(`${API_URL}/login`, params)
      .then((res) => res.json())
      .then((e) => resolve(e))
      .catch((err) => reject(err.message));
  });

export { loginUser };
