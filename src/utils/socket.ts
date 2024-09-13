import { ClientEvents, ServerEvents } from "@/types/api/socket";
import { Socket, io } from "socket.io-client";
import { SocketNamespace } from "./constants";

const commentSocketInstance: Socket<ServerEvents, ClientEvents> = io(
  `http://localhost:8000${SocketNamespace.COMMENT}`
);

export { commentSocketInstance };
