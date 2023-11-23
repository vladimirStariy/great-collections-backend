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
import { SocketUserGuard } from "src/auth/guards/socket.user.guard";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { CollectionService } from "src/collection/collection.service";
 
export interface CommentPayload {
    userId: number;
    collectionItemId: number;
    text: string;
}

@WebSocketGateway({
    cors: true
})
export class CommentGateway implements OnGatewayConnection, OnGatewayDisconnect {
    
    constructor(private jwtService: JwtService,
                private commentService: CommentService,
                private userService: UserService,
                private collectionService: CollectionService) {}
    
    @WebSocketServer() server: Server;
    private connectedClients: Socket[] = [];
 
    handleConnection(client: Socket) {
      this.connectedClients.push(client);
    }
   
    handleDisconnect(client: Socket) {
      this.connectedClients.splice(this.connectedClients.indexOf(client), 1);
    }

    @SubscribeMessage('getLikes') 
    async getLikes(@ConnectedSocket() socket: Socket, @MessageBody() payload: number) {
        let auth_token = socket.handshake.headers.authorization;
        let isLiked = undefined;
        let accessToken = auth_token.split(' ')[1];
        if(accessToken !== null && accessToken !== 'null') {
          console.log(accessToken)
          const token = auth_token.split(' ')[1]
          const decoded = this.jwtService.decode(token);
          const liked = await this.collectionService.checkLiked(payload, decoded.email);
          isLiked = liked; 
        }
        const likes = await this.collectionService.getLikes(payload);
        this.connectedClients.forEach(x => {x.emit('getLikes', {likes, isLiked})})
        return likes;
    }

    @SubscribeMessage('like-item')
    async likeItem(@ConnectedSocket() socket: Socket, @MessageBody() payload: { collectionItemId: number}) {
        let auth_token = socket.handshake.headers.authorization;
        const token = auth_token.split(' ')[1]
        const decoded = this.jwtService.decode(token);
        await this.collectionService.likeItem(payload.collectionItemId, decoded.email);
        this.connectedClients.forEach(x => {x.emit('like-item', 1)})
    }

    @SubscribeMessage('unlike-item')
    async unlikeItem(@ConnectedSocket() socket: Socket, @MessageBody() payload: { collectionItemId: number}) {
        let auth_token = socket.handshake.headers.authorization;
        const token = auth_token.split(' ')[1]
        const decoded = this.jwtService.decode(token);
        await this.collectionService.unlikeItem(payload.collectionItemId, decoded.email);
        const likes = this.getLikes(socket, payload.collectionItemId);
        this.connectedClients.forEach(x => {x.emit('like-item', likes)})
    }

    @SubscribeMessage('getComments') 
    async getComments(@MessageBody() payload: number) {
      const comments = await this.commentService.getCommentsByItemId(payload);
      this.connectedClients.forEach(x => {x.emit('getComments', comments)})
    }

    @SubscribeMessage('comment') 
    async handleInitialize(@ConnectedSocket() socket: Socket, @MessageBody() payload: CommentPayload) {
        let auth_token = socket.handshake.headers.authorization;
        const token = auth_token.split(' ')[1]
        const decoded = this.jwtService.decode(token);
        const user = await this.userService.getByEmail(decoded.email)
        payload.userId = user.id;
        const comment = await this.commentService.createComment(payload)
        const commentDto = await this.commentService.getCommentById(comment.id);
        this.connectedClients.forEach(x => {x.emit('comment', commentDto)})
    }   
}