import { HttpException, Injectable, Logger } from "@nestjs/common";
import { Users } from "@user/domain/entity/user.entity";
import { CreateIpDto } from "@ip/dto/action/createIp.dto";
import { UpdateIpDto } from "@ip/dto/action/updateIp.dto";
import { IpRepository } from "@ip/infra/ip.repository";
import requestIp from "request-ip";
import { DataSource, QueryRunner } from "typeorm";

@Injectable()
export class IpService {
  constructor(
    private readonly ipRepository: IpRepository,
    private readonly dataSource: DataSource
  ) {}
  private static readonly logger = new Logger("ip");

  async createIp(user: Users, body: CreateIpDto) {
    const queryRunner: QueryRunner =
      this.dataSource.createQueryRunner("master");
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.ipRepository.createIp(
        user,
        body,
        queryRunner.manager
      );
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {}
  }

  async updateIp(user: Users, ipId: number, body: UpdateIpDto) {
    const queryRunner: QueryRunner =
      this.dataSource.createQueryRunner("master");
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.ipRepository.updateIp(
        user,
        ipId,
        body,
        queryRunner.manager
      );
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      IpService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteIp(user: Users, ipId: number) {
    const queryRunner: QueryRunner =
      this.dataSource.createQueryRunner("master");
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.ipRepository.deleteIp(
        user,
        ipId,
        queryRunner.manager
      );
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      IpService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllIp(user: Users) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner("slave");
    await queryRunner.connect();
    try {
      const result = await this.ipRepository.findAllIp(
        user,
        queryRunner.manager
      );
      return result;
    } catch (error) {
      IpService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async findIp(user: Users, ipId: number) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner("slave");
    await queryRunner.connect();
    try {
      const reuslt = await this.ipRepository.findIp(
        user,
        ipId,
        queryRunner.manager
      );
      return reuslt;
    } catch (error) {
      IpService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async accessIp(req: requestIp.Request) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner("slave");
    await queryRunner.connect();
    try {
      const ip: string = requestIp.getClientIp(req);
      console.log(ip);
      const result = await this.ipRepository.accessIp(ip, queryRunner.manager);
      return result;
    } catch (error) {
      IpService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async allowIp() {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner("slave");
    await queryRunner.connect();
    try {
      const result = await this.ipRepository.allowIp(queryRunner.manager);
      return result;
    } catch (error) {
      IpService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }
}
