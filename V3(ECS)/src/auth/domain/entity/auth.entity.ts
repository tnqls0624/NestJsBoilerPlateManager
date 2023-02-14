import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { Users } from 'src/user/domain/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Index('id', ['id'], { unique: true })
@Entity({ name: 'auth' })
export class Auth {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ApiProperty({
    example: 'djsabcjxzcoj34258493yfbdjsk',
    description: '재발급 토큰',
  })
  @IsString()
  @IsNotEmpty()
  @Column()
  refreshToken!: string;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updated_at!: Date;

  @OneToOne(() => Users, (user) => user.Auth, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userId!: string;
}
