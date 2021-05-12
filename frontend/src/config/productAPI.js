import {API} from '../constant/API'
import {AXIOS_INSTANCE} from './environment'
export const productAPI = {
    signup: (password) => {
      return AXIOS_INSTANCE.post(API.SIGNUP, {password});
    },
};