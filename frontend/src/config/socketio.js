import io from "socket.io-client";
import { BASE_URL } from "./environment";

const socket = io(BASE_URL);
//const socket = io();
export default socket;