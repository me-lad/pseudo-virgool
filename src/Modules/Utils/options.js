const baseApi = "";
let apiToken = "Bearer ";

//! Token setter function
const setToken = (token) => {
  apiToken = `Bearer ${token}`;
};

const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    setToken(token);
  }
};

export { baseApi, apiToken, setToken, getToken };
