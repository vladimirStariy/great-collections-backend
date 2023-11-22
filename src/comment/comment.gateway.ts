import { WebSocketGateway, 
         SubscribeMessage, 
         MessageBody, 
         WebSocketServer,
         ConnectedSocket, 
         OnGatewayConnection,
         OnGatewayDisconnect
} from "@nestjs/websockets";
import { Socket, Server } from 'socket.io'
import { CommentService } from "./comment.service";

import { CreateCommentRequest } from "./dto/comment.dto";

import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
 
export interface InitPayload {
    collectionIemId: number;
}

@WebSocketGateway({
    cors: true
})
export class CommentGateway implements OnGatewayConnection, OnGatewayDisconnect {
    
    constructor(private commentService: CommentService) {}
    
    @WebSocketServer() server: Server;

    private connectedClients: Socket[] = [];
 
    handleConnection(client: Socket) {
      this.connectedClients.push(client);
    }
   
    handleDisconnect(client: Socket) {
      this.connectedClients.splice(this.connectedClients.indexOf(client), 1);
    }

    
    @SubscribeMessage('comment') 
    async handleInitialize(@ConnectedSocket() socket: Socket, @MessageBody() payload: string) {
        console.log(socket);
        const token = socket.handshake.headers.authorization.split('Bearer ')[1];
        console.log(token)
        this.connectedClients.forEach(x => {x.emit('comment', payload)})
    }   
}