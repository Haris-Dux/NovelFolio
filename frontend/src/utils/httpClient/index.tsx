import axios from "axios";

const BASEURL = "https://api.taskproject.site/api";
const TIMEOUTMSG = "Request timed out. Please try again.";

const config = {
  baseURL: BASEURL,
  timeout: 20000,
  timeoutErrorMessage: TIMEOUTMSG,
};

// config.headers["cache-control"] = `no-cache`;
const http = axios.create(config);

export default http;
