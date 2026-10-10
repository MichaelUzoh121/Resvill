import { io } from "socket.io-client";

import env from "../config/env";

let socket = null;

let socketConfigKey = null;

const getSocketConfigKey = ({
  orderNumber,
  trackingToken,
} = {}) => {
  if (orderNumber && trackingToken) {
    return `guest:${orderNumber}:${trackingToken}`;
  }

  return "authenticated";
};

export const connectSocket = ({
  orderNumber,
  trackingToken,
} = {}) => {
  const nextConfigKey = getSocketConfigKey({
    orderNumber,
    trackingToken,
  });

  if (
    socket &&
    socketConfigKey === nextConfigKey
  ) {
    if (!socket.connected) {
      socket.connect();
    }

    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socketConfigKey = nextConfigKey;

  socket = io(env.socketUrl, {
    withCredentials: true,
    autoConnect: false,
    transports: ["websocket"],

    auth:
      orderNumber && trackingToken
        ? {
            orderNumber,
            trackingToken,
          }
        : undefined,
  });

  socket.connect();

  return socket;
};

export const disconnectSocket = () => {
  if (!socket) {
    return;
  }

  socket.disconnect();

  socket = null;
  socketConfigKey = null;
};

export const getSocket = () => {
  return socket;
};

export const subscribeToSocketEvents = (events = {}) => {
  const socketInstance = getSocket();

  if (!socketInstance) {
    return () => {};
  }

  Object.entries(events).forEach(([event, handler]) => {
    if (typeof handler === "function") {
      socketInstance.on(event, handler);
    }
  });

  return () => {
    Object.entries(events).forEach(([event, handler]) => {
      if (typeof handler === "function") {
        socketInstance.off(event, handler);
      }
    });
  };
};

export default socket;

