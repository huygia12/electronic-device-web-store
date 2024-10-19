import { SocketContext, SocketContextProps } from "@/context";
import { useContext } from "react";

const useSocket = (): SocketContextProps => {
  const authContext = useContext(SocketContext);

  if (!authContext) {
    throw new Error("useSocket must be used within an SocketProvider");
  }

  return authContext;
};

export default useSocket;
