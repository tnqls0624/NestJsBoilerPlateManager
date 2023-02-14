import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { Users } from "@user/domain/entity/user.entity";

@Entity({ name: "ip" })
export class Ip {
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
    example: "10.0.0.1",
    description: "아이피 주소",
  })
  @Transform((params) => params.value.trim())
  @IsString()
  @IsNotEmpty()
  @Column({
    type: "varchar",
    comment: "아이피 주소",
    unique: true,
  })
  address: string;

  @ApiProperty({
    example: true,
    description: "활성화 여부",
  })
  @IsBoolean()
  @IsNotEmpty()
  @Column({
    type: "boolean",
    comment: "활성화 여부",
  })
  isActive: boolean;

  @ApiProperty({
    example: "이수빈입니당~",
    description: "메모",
  })
  @Column({
    type: "varchar",
    comment: "메모",
    default: "",
  })
  memo: string;

  @CreateDateColumn({ name: "create_at", comment: "생성일" })
  create_at: Date;

  @UpdateDateColumn({ name: "update_at", comment: "수정일" })
  update_at: Date;

  @ManyToOne(() => Users, (user) => user.Ip, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  User: Users;
}
