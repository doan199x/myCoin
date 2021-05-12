import axios from "axios";

const { CLIENT_ENV = "dev" } = process.env;

const envInfo = {
  dev: {
    BASE_URL: "http://localhost:3001",
    // BASE_URL: "deploy"
    // BASE_URL: "http://192.168.1.4:3001/"
  },
};

export const AXIOS_INSTANCE = axios.create({
  baseURL: envInfo[CLIENT_ENV].BASE_URL,
});

export const { BASE_URL } = envInfo[CLIENT_ENV];

export const BASE_URL_LOGIN = envInfo.login;
