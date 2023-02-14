import { HttpException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Connection,
  EntityManager,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import { Errors } from "@errors/domain/entity/errors.entity";
import { SaveErrorsDto } from "@errors/dto/saveErrors.dto";
import { PageOptionsDto } from "@utils/paginate/dto/pageOptions.dto";
import { PageDto } from "@utils/paginate/dto/page.dto";
import { PageMetaDto } from "@utils/paginate/dto/pageMeta.dto";
@Injectable()
export class ErrorsRepository {
  constructor() {}

  private static readonly logger = new Logger("erros");

  async findAllErrors(
    userId: number,
    projectId: number,
    fromDate: string,
    toDate: string,
    pageOptionsDto: PageOptionsDto,
    manager: EntityManager
  ) {
    try {
      const queryBuilder: SelectQueryBuilder<Errors> = manager
        .createQueryBuilder(Errors, "e")
        .select([
          "e.id",
          "e.content",
          "e.projectId",
          "e.sender",
          "e.reason",
          "e.create_at",
          "e.update_at",
          "pj.id",
          "pj.projectName",
        ])
        .leftJoin("e.Project", "pj")
        .where("e.userId = :userId", { userId });

      if (projectId) {
        queryBuilder.andWhere("e.projectId = :projectId", { projectId });
      }

      if (fromDate && toDate) {
        queryBuilder.andWhere("m.depositDate BETWEEN :fromDate AND :toDate", {
          fromDate,
          toDate,
        });
      }

      queryBuilder
        .orderBy("e.id", "DESC")
        .skip((pageOptionsDto.page - 1) * pageOptionsDto.limit)
        .take(pageOptionsDto.limit);
      const itemCount: number = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();
      const pageMetaDto: PageMetaDto = new PageMetaDto({
        itemCount,
        pageOptionsDto,
      });
      return new PageDto(entities, pageMetaDto);
    } catch (error) {
      ErrorsRepository.logger.error(error);
      throw new HttpException(error, 400);
    }
  }

  async saveErrors(body: SaveErrorsDto, manager: EntityManager) {
    const errors: Errors = await manager.save(Errors, body);
    return errors;
  }

  async duplicatedErrorCheck(content: string, manager: EntityManager) {
    return manager.findOne(Errors, {
      where: {
        content,
      },
    });
  }
}
