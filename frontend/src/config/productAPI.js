import {API} from '../constant/API'
import {AXIOS_INSTANCE} from './environment'
export const productAPI = {
    signup: (password) => {
      return AXIOS_INSTANCE.post(API.SIGNUP, {password});
    },
    password: (password) => {
      return AXIOS_INSTANCE.post(API.PASSWORD, {password});
    },
    getWallet: (key, pk) => {
      return AXIOS_INSTANCE.post(API.GETWALLET, {key, pk});
    },
};