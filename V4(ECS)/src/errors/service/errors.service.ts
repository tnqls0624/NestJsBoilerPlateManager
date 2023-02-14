import { HttpException, Injectable, Logger } from "@nestjs/common";
import { SaveErrorsDto } from "@errors/dto/saveErrors.dto";
import { ErrorsRepository } from "@errors/infra/errors.repository";
import { PageOptionsDto } from "@utils/paginate/dto/pageOptions.dto";
import { DataSource, QueryRunner } from "typeorm";
@Injectable()
export class ErrorsService {
  constructor(
    private readonly errorsRepository: ErrorsRepository,
    private readonly dataSource: DataSource
  ) {}
  private static readonly logger = new Logger("erros");
  async findAllErrors(
    userId: number,
    projectId: number,
    fromDate: string,
    toDate: string,
    PageOptionsDto: PageOptionsDto
  ) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner("slave");
    await queryRunner.connect();
    try {
      const message = await this.errorsRepository.findAllErrors(
        userId,
        projectId,
        fromDate,
        toDate,
        PageOptionsDto,
        queryRunner.manager
      );
      return message;
    } catch (error) {
      ErrorsService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async saveErrors(body: SaveErrorsDto) {
    const queryRunner: QueryRunner =
      this.dataSource.createQueryRunner("master");
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.errorsRepository.saveErrors(
        body,
        queryRunner.manager
      );
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      ErrorsService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async duplicatedErrorCheck(content: string) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner("slave");
    await queryRunner.connect();
    try {
      const result = await this.errorsRepository.duplicatedErrorCheck(
        content,
        queryRunner.manager
      );
      return result;
    } catch (error) {
      ErrorsService.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }
}
