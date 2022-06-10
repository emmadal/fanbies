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
export const registerUser = () => "";
