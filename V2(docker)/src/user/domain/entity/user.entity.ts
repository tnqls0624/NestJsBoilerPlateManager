import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Auth } from 'src/auth/domain/entity/auth.entity';
import { Transform } from 'class-transformer';
import { Varification } from 'src/varifications/domain/entity/varifications.entity';

export enum UserTypeEnum {
  KAKAO = 'KAKAO',
  GOOGLE = 'GOOGLE',
  NAVER = 'NAVER',
  SIGNNAME = 'SIGNNAME',
}

@Index('id', ['id'], { unique: true })
@Entity({ name: 'user' })
export class Users {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: 'SIGNNAME',
    description: '메소드',
  })
  @Transform((params) => params.value.trim())
  @IsEnum(UserTypeEnum)
  @IsNotEmpty()
  @Column({
    type: 'varchar',
    comment: '로그인 방식(SIGNNAME/KAKAO/GOOGLE/APPLE)',
  })
  method: UserTypeEnum;

  @ApiProperty({
    example: 'dktnqls0624',
    description: '아이디',
  })
  @Transform((params) => params.value.trim())
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: '숫자, 영(소, 대)문자만 입력할 수 있습니다!',
  })
  @Column({ type: 'varchar', length: 20, comment: '유저 아이디', unique: true })
  signname: string;

  @ApiProperty({
    example: 'test1234!',
    description: '비밀번호',
  })
  @Transform((params) => params.value.trim())
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @IsNotEmpty()
  @Matches(/^[A-Za-z\d$!@#$%^&*?&]{8,15}$/, {
    message:
      '영(소, 대)문자, 특수문자($!@#$%^&*?&)만 입력이 가능하고, 8~15글자 이내에 입력 해 주세요!',
  })
  @Column({ type: 'varchar', comment: '유저 비밀번호' })
  password: string;

  @ApiProperty({
    example: '이수빈',
    description: '이름',
  })
  @Transform((params) => params.value.trim())
  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  @Matches(/^[0-9A-Za-zㄱ-ㅎㅏ-ㅣ-가-힣]+$/, {
    message: '숫자,영(소, 대)문자, 한글만 입력 가능 합니다!',
  })
  @Column({ type: 'varchar', length: 15, comment: '유저 이름' })
  name: string;

  @ApiProperty({
    example: 'dktnqls0624@itechcompany.kr',
    description: '이메일',
  })
  @Transform((params) => params.value.trim())
  @IsEmail()
  @IsNotEmpty()
  @Matches(/^[0-9A-Za-z]+@[0-9A-Za-z]+\.([a-z]+)*$/, {
    message: '이메일 형식에 맞게 입력 해 주세요!',
  })
  @Column('varchar', {
    name: 'email',
    unique: true,
    comment: '유저 이메일',
  })
  email: string;

  @ApiProperty({
    example: '01011112222',
    description: '핸드폰번호',
  })
  @Transform((params) => params.value.trim())
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsNotEmpty()
  @Matches(/^01(?:0|1|[6-9])?(\d{3}|\d{4})?(\d{4})$/, {
    message: '핸드폰 번호의 형식에 맞게 입력해주세요!',
  })
  @Column('varchar', {
    name: 'phone',
    unique: true,
    comment: '유저 전화번호',
  })
  phone: string;

  @IsBoolean()
  @IsNotEmpty()
  @Column('boolean', {
    name: 'varifymail',
    comment: '이메일 인증 여부',
  })
  varifymail: boolean;

  @IsString()
  @IsNotEmpty()
  @Column('boolean', {
    name: 'withdraw',
    comment: '탈퇴 여부',
  })
  withdraw: boolean;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  created_at: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updated_at: Date;

  @Column({ name: 'withdraw_at', comment: '탈퇴일' })
  withdraw_at: string;

  @OneToOne(() => Auth, (auth) => auth.userId)
  Auth: Auth;

  @OneToMany(() => Varification, (varification) => varification.User)
  Varification: Varification;
}
