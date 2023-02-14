import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Users } from "@user/domain/entity/user.entity";
import { Project } from "@project/domain/entity/project.entity";

@Entity({ name: "errors" })
export class Errors {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: 1,
    description: "유저아이디",
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({
    type: "int",
    comment: "유저아이디",
  })
  userId: number;

  @ApiProperty({
    example: 1,
    description: "프로젝트 아이디",
  })
  @IsNumber()
  @IsNotEmpty()
  @Column({ type: "int", comment: "프로젝트 아이디" })
  projectId: number;

  @ApiProperty({
    example: "카카오뱌ㅐㅇ크~~~",
    description: "메세지 원문",
  })
  @IsString()
  @IsNotEmpty()
  @Column({
    type: "varchar",
    comment: "메세지 원문",
  })
  content: string;

  @ApiProperty({
    example: "15885588",
    description: "발신자번호",
  })
  @IsString()
  @Column({
    type: "varchar",
    comment: "메세지 원문",
  })
  sender: string;

  @ApiProperty({
    example: "15885588",
    description: "발신자번호",
  })
  @IsString()
  @IsNotEmpty()
  @Column({
    type: "varchar",
    comment: "에러 이유",
  })
  reason: string;

  @CreateDateColumn({ name: "create_at", comment: "생성일" })
  create_at: Date;

  @UpdateDateColumn({ name: "update_at", comment: "수정일" })
  update_at: Date;

  @ManyToOne(() => Users, (user) => user.Phone, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  User: Users;

  @ManyToOne(() => Project, (project) => project.Phone, {
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "projectId", referencedColumnName: "id" }])
  Project: Project;
}
