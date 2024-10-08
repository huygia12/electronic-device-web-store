import { ClientEvents, ServerEvents } from "@/types/socket";
import { Socket, io } from "socket.io-client";

const socketInstance: Socket<ServerEvents, ClientEvents> = io(
  `http://localhost:8000`
);

export { socketInstance };
