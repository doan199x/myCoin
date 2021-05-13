import {API} from '../constant/API'
import {AXIOS_INSTANCE} from './environment'
export const productAPI = {
    signup: (password) => {
      return AXIOS_INSTANCE.post(API.SIGNUP, {password});
    },
    password: (password) => {
      return AXIOS_INSTANCE.post(API.PASSWORD, {password});
    },
    signin: (key, password) => {
      return AXIOS_INSTANCE.post(API.SIGNIN, {key, password});
    },
    checkToken: () => {
      return AXIOS_INSTANCE.post(API.CHECKTOKEN);
    },
};