import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Users } from 'src/user/domain/entity/user.entity';
import { EntityManager } from 'typeorm';
import { Ip } from '../domain/entity/ip.entity';
import { CreateIpDto } from '../dto/action/createIp.dto';
import { UpdateIpDto } from '../dto/action/updateIp.dto';

@Injectable()
export class IpRepository {
  private static readonly logger = new Logger('ip');

  async createIp(user: Users, body: CreateIpDto, manager: EntityManager) {
    const ip: Ip = await manager.findOne(Ip, {
      where: {
        userId: user.id,
        address: body.address,
      },
    });
    if (ip) {
      IpRepository.logger.error('중복된 아이피 입니다');
      throw new HttpException('duplicated ip', 400);
    }
    await manager.save(Ip, {
      userId: user.id,
      address: body.address,
      isActive: body.isActive,
      memo: body.memo,
    });
    return true;
  }

  async updateIp(
    user: Users,
    ipId: number,
    body: UpdateIpDto,
    manager: EntityManager,
  ) {
    const ip = await manager.findOne(Ip, {
      where: {
        id: ipId,
        userId: user.id,
      },
    });

    if (!ip) {
      IpRepository.logger.error('아이피가 존재하지 않습니다.');
      throw new HttpException('no ip', 400);
    }
    await manager.update(
      Ip,
      {
        id: ip.id,
      },
      body,
    );
    return true;
  }

  async deleteIp(user: Users, ipId: number, manager: EntityManager) {
    const ip: Ip = await manager.findOne(Ip, {
      where: {
        id: ipId,
      },
    });
    if (!ip) {
      IpRepository.logger.error('아이피가 존재하지 않습니다.');
      throw new HttpException('아이피가 존재하지 않습니다', 400);
    }
    await manager.delete(Ip, {
      id: ipId,
    });
    return true;
  }

  async findAllIp(user: Users, manager: EntityManager) {
    const ips = await manager.find(Ip, {
      where: {
        userId: user.id,
      },
    });
    return ips;
  }

  async findIp(user: Users, ipId: number, manager: EntityManager) {
    const ip: Ip = await manager.findOne(Ip, {
      where: {
        id: ipId,
        userId: user.id,
      },
    });

    if (!ip) {
      throw new HttpException('아이피가 존재하지 않습니다', 400);
    }
    return ip;
  }

  async accessIp(ip: string, manager: EntityManager) {
    const accessIp: Ip[] = await manager.find(Ip, {
      where: {
        address: ip,
        isActive: true,
      },
    });
    if (!accessIp.length) {
      throw new HttpException('접속이 제한된 아이피입니다', 400);
    }
    return true;
  }

  async allowIp(manager: EntityManager) {
    const accessIp: Ip[] = await manager.find(Ip, {
      where: {
        isActive: true,
      },
    });
    return accessIp;
  }
}
