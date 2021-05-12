export const TYPE = {
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",
  CALLING_API: "CALLING_API",
  DONE_CALL: "DONE_CALL",
  BEGIN_MINER: "BEGIN_MINER",
  STOP_MINER: "STOP_MINER",
  SET_BALANCE: "SET_BALANCE"
}

export const initialState = {
  privateKey: "",
  publicKey: "",
  isLoading: false,
  balance: 0,
  isMining: false
};

const reducer = (state, action) => {
  let infoToken = { ...state };
  switch (action.type) {
    case TYPE.SET_USER:
      infoToken.privateKey = action.payload.key.privateKey;
      infoToken.publicKey = action.payload.key.publicKey;
      infoToken.balance = action.payload.balance;
      infoToken.isLoading = false;
      return infoToken;
    case TYPE.SET_BALANCE:
      infoToken.balance = action.payload.balance;
      return infoToken;
    case TYPE.CALLING_API:
      infoToken.isLoading = true;
      return infoToken;
    case TYPE.DONE_CALL:
      infoToken.isLoading = false;
      return infoToken;
    case TYPE.LOGOUT:
      infoToken = initialState;
      return infoToken;
    case TYPE.BEGIN_MINER:
      infoToken.isMining = true;
      return infoToken;
    case TYPE.STOP_MINER:
      infoToken.isMining = false;
      return infoToken;
    default:
      return state;
  }
};

export default reducer;
