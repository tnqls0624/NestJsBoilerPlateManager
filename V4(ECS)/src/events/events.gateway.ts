// import { Logger } from "@nestjs/common";
// import {
//   ConnectedSocket,
//   OnGatewayConnection,
//   OnGatewayInit,
//   WebSocketGateway,
//   WebSocketServer,
// } from "@nestjs/websockets";
// import { Server, Socket } from "socket.io";
// import { UpdatePhoneDto } from "src/phone/dto/action/updatePhone.dto";
// import { PhoneService } from "src/phone/service/phone.service";
// import { ProjectService } from "src/project/service/project.service";
// import { UserService } from "src/user/service/user.service";
// import { UpdatePhoneDisForceDto } from "src/phone/dto/action/updatePhoneDisForce.dto";
// import TelegramBot from "node-telegram-bot-api";
// import moment from "moment";
// export interface Webhook {
//   id: number;
//   regdate: Date;
//   amount: number;
//   itype: string;
//   bank_code: string;
//   bank_account: string;
//   code: string;
// }
// @WebSocketGateway({
//   cors: { origin: "*" },
//   transports: ["websocket"],
//   namespace: /\/ws-.+/,
//   allowEIO3: true,
// })
// export class EventsGateway implements OnGatewayConnection, OnGatewayInit {
//   constructor(
//     private readonly phoneService: PhoneService,
//     private readonly projectService: ProjectService,
//     private readonly userService: UserService
//   ) {}

//   private static readonly logger = new Logger(EventsGateway.name);

//   @WebSocketServer()
//   server: Server;

//   afterInit() {
//     EventsGateway.logger.log(`Socket Server Init Complete`);
//   }

//   //앱 연결시
//   async handleConnection(@ConnectedSocket() socket: Socket) {
//     let id: NodeJS.Timeout;

//     EventsGateway.logger.log(`${socket.id} is connected...`);
//     socket.emit(
//       "connectMessage",
//       `${socket.handshake.query.phone}가 연결되었습니다`
//     );

//     if (socket.handshake.query.phone) {
//       const bot = new TelegramBot(
//         "5947397447:AAFViAPwbtXj8c7I61My30tNDuBaeKOe_jw",
//         {
//           polling: false,
//         }
//       );

//       bot.sendMessage(
//         "-867766149",
//         `[ 소켓이 연결되었습니다 ]\n${moment().format(
//           "YYYY-MM-DD HH:mm:ss"
//         )}\n핸드폰 번호: ${socket.handshake.query.phone}`
//       );
//     }

//     if (id) {
//       clearInterval(id);
//     }

//     socket.on("disconnect", async () => {
//       if (id) {
//         clearInterval(id);
//       }
//       EventsGateway.logger.log(`${socket.id} 연결 끊었습니다...`);
//       const newNamespace = socket.nsp;
//       const args: UpdatePhoneDisForceDto = {
//         socketId: socket.id,
//         isActive: false,
//       };
//       const phone = await this.phoneService.updatePhoneDisForce(args);
//       if (phone) {
//         const project = await this.projectService.findProject(
//           String(phone.projectId)
//         );
//         const phoneAll = await this.phoneService.findAllPhone(
//           Number(phone.userId)
//         );
//         newNamespace.emit("onlineList", phoneAll);
//         if (project.telegramToken && project.telegramChatId) {
//           const bot = new TelegramBot(project.telegramToken, {
//             polling: false,
//           });
//           bot.sendMessage(
//             project.telegramChatId,
//             `[ 핸드폰 연결이 끊겼습니다 ]\n${moment().format(
//               "YYYY-MM-DD HH:mm:ss"
//             )}\n프로젝트: ${project.projectName}\n핸드폰 번호: ${phone.phone}`
//           );
//         }
//       }
//     });

//     socket.on(
//       "active",
//       async (data: {
//         userId: number;
//         projectId: number;
//         phone: string;
//         phoneModel: string;
//         mobileCarrier: string;
//       }) => {
//         if (id) {
//           clearInterval(id);
//         }
//         id = setInterval(() => {
//           socket.emit("ping", "2");
//         }, 10_000);
//         const newNamespace = socket.nsp;
//         EventsGateway.logger.log(`${JSON.stringify(data)}`);
//         const user = await this.userService.findUserIdUseSocket(data.userId);
//         if (!user) {
//           EventsGateway.logger.error("해당 유저는 존재하지 않습니다");
//           newNamespace.emit("errors", "해당 유저는 존재하지 않습니다");
//         }
//         const project = await this.projectService.findProjectUseSocket(
//           String(data.projectId)
//         );
//         if (!project) {
//           EventsGateway.logger.error("프로젝트가 존재하지 않습니다.");
//           newNamespace.emit("errors", "프로젝트가 존재하지 않습니다.");
//         }
//         if (!project.isActive) {
//           EventsGateway.logger.error("프로젝트가 활성화 되어 있지 않습니다.");
//           newNamespace.emit("errors", "프로젝트가 활성화 되어 있지 않습니다.");
//         }
//         const phone = await this.phoneService.createPhone(data, socket.id);
//         socket.join(String(data.userId));
//         const args: UpdatePhoneDto = {
//           isActive: true,
//         };
//         await this.phoneService.updatePhone(args);
//         const phoneAll = await this.phoneService.findAllPhone(
//           Number(data.userId)
//         );
//         newNamespace.emit("onlineList", phoneAll);
//       }
//     );
//   }
// }
