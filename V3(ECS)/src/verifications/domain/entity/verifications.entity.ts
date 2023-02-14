import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Users } from 'src/user/domain/entity/user.entity';

export enum VerificationTypeEnum {
  MAIL = 'MAIL',
  SIGNNAME = 'SIGNNAME',
  PASSWORD = 'PASSWORD',
}

@Index('id', ['id'], { unique: true })
@Entity({ name: 'varification' })
export class Verification {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ApiProperty({
    example: 'PASSWORD',
    description: '타입',
  })
  @Transform((params) => params.value.trim())
  @IsEnum(VerificationTypeEnum)
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 10, comment: '타입' })
  type!: VerificationTypeEnum;

  @ApiProperty({
    example: 'dktnqls0624@itechcompany.kr',
    description: '받는 이메일 주소',
  })
  @Transform((params) => params.value.trim())
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', comment: '보낼 주소' })
  to!: string;

  @ApiProperty({
    example: 'vbdfibi',
    description: '토큰',
  })
  @Transform((params) => params.value.trim())
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 20, comment: '토큰' })
  token!: string;

  @ApiProperty({
    example: '123456',
    description: '키값',
  })
  @Transform((params) => params.value.trim())
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 10, comment: '키값' })
  key!: string;

  @ApiProperty({
    example: 1,
    description: '아이디',
  })
  @Transform((params) => params.value.trim())
  @IsNumber()
  @MinLength(5)
  @MaxLength(20)
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: '숫자, 영(소, 대)문자만 입력할 수 있습니다!',
  })
  @Column({ type: 'int', comment: '유저 아이디' })
  user_id!: number;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updated_at!: Date;

  @ManyToOne(() => Users, (user) => user.Varification, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User!: Users;
}
