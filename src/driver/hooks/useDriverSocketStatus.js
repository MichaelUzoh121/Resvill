import { useEffect, useState } from "react";

import {
  connectSocket,
  getSocket,
} from "../../services/socketService";

function useDriverSocketStatus() {
  const [isConnected, setIsConnected] = useState(() => {
    const socket = getSocket();

    return Boolean(socket?.connected);
  });

  const [isConnecting, setIsConnecting] = useState(() => {
    const socket = getSocket();

    return Boolean(socket && !socket.connected);
  });

  useEffect(() => {
    const socket = getSocket() || connectSocket();

    if (!socket) {
      return undefined;
    }

    const handleConnect = () => {
      setIsConnected(true);
      setIsConnecting(false);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setIsConnecting(true);
    };

    const handleConnectError = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };

    setIsConnected(socket.connected);
    setIsConnecting(!socket.connected && !socket.active);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  return {
    isConnected,
    isConnecting,
  };
}

export default useDriverSocketStatus;