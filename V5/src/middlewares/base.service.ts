import {Injectable, Logger} from '@nestjs/common';
import CustomError from 'src/common/error/custom-error';
import {DataSource, QueryRunner} from 'typeorm';

@Injectable()
export class BaseService {
  constructor(protected readonly dataSource: DataSource) {}
  protected static readonly logger = new Logger('BaseService');
  async executeQueryRunner(
    action: any,
    mode: 'master' | 'slave',
    isTransaction = false
  ) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner(mode);
    await queryRunner.connect();
    if (isTransaction) await queryRunner.startTransaction();
    try {
      const result = await action(queryRunner.manager);
      if (isTransaction) await queryRunner.commitTransaction();
      return result;
    } catch (error: any) {
      BaseService.logger.error(error);
      if (isTransaction) await queryRunner.rollbackTransaction();
      throw new CustomError(error.code, {
        data: (error as Error).stack,
        context: (error as Error).message,
      });
    } finally {
      await queryRunner.release();
    }
  }
}
