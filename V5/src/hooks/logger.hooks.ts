import {Logger} from '@nestjs/common';
import {FastifyInstance} from 'fastify';
import {getModuleFileName} from 'src/utils/commonUtil';

const logger = new Logger(getModuleFileName(__filename));

export default function addLoggerHook(
  server: FastifyInstance
): FastifyInstance {
  return server.addHook('onResponse', (request, response, next) => {
    if (request.url !== '/') {
      const {ip, method, url, body, headers} = request;
      const {statusCode} = response;
      const protocol = request.headers['x-forwarded-proto'] || 'http';
      const fullUrl = `${protocol}://${headers.host}${url}`;

      logger.log(
        `method : ${method}, url : ${fullUrl}, statusCode : ${statusCode}, ip: ${ip}, content-type : ${
          headers['content-type']
        }, body : ${JSON.stringify(body)}`
      );
    }

    next();
  });
}
