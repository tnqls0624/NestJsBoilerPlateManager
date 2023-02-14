import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

@Entity({ name: "setting" })
export class Setting {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: true,
    description: "활성화 여부",
  })
  @IsBoolean()
  @IsNotEmpty()
  @Column({ type: "boolean", comment: "IP 필터링 활성화 여부" })
  isActive: boolean;

  @CreateDateColumn({ name: "create_at", comment: "생성일" })
  create_at: Date;

  @UpdateDateColumn({ name: "update_at", comment: "수정일" })
  update_at: Date;
}
