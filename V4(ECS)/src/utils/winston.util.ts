import { utilities, WinstonModule } from "nest-winston";
import winstonDaily from "winston-daily-rotate-file";
import winston from "winston";
import path from "path";
import appRoot from "app-root-path";
import moment from "moment-timezone";
const env = process.env.MODE;
const logDir = path.normalize(`${appRoot}/logs`); // log 파일을 관리할 폴더
const dailyOptions = (level: string) => {
  return {
    level,
    colorize: true,
    datePattern: "YYYY-MM-DD",
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    json: false,
    maxFiles: 30, //30일치 로그파일 저장
    zippedArchive: true, // 로그가 쌓이면 압축하여 관리
  };
};
// rfc5424를 따르는 winston만의 log level
// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: env === "prod" ? "http" : "silly",
      // level: 'http',
      // production 환경이라면 http, 개발환경이라면 모든 단계를 로그
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike("server", {
          prettyPrint: true, // nest에서 제공하는 옵션. 로그 가독성을 높여줌
        })
      ),
    }),

    // info, warn, error 로그는 파일로 관리
    new winstonDaily(dailyOptions("info")),
    new winstonDaily(dailyOptions("error")),
  ],
  format: winston.format.printf(({ level, message, args = [] }) => {
    return (
      moment().format("YYYY-MM-DD HH:mm:ss") +
      " [" +
      level.toUpperCase() +
      "] - " +
      message +
      args
    );
  }),
});
