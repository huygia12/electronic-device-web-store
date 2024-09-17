import { ClientEvents, ServerEvents } from "@/types/socket";
import { Socket, io } from "socket.io-client";
import { SocketNamespace } from "@/types/enum";

const commentSocketInstance: Socket<ServerEvents, ClientEvents> = io(
  `http://localhost:8000${SocketNamespace.COMMENT}`
);

export { commentSocketInstance };
