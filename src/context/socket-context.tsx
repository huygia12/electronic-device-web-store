import { ClientEvents, ServerEvents } from "@/types/api/socket";
import { createContext, useEffect, ReactNode, useState } from "react";
import { Socket } from "socket.io-client";
import { commentSocketInstance } from "@/utils/socket";

interface SocketContextProps {
  commentSocket: Socket<ServerEvents, ClientEvents> | undefined;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [commentSocket, setCommentSocket] =
    useState<Socket<ServerEvents, ClientEvents>>();

  useEffect(() => {
    commentSocketInstance.on("connect", () => {
      setCommentSocket(commentSocketInstance);
    });
  }, []);

  return (
    <SocketContext.Provider value={{ commentSocket: commentSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext, type SocketContextProps };
