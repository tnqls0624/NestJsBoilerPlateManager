import { Injectable } from '@nestjs/common';
import { UserRepository } from '../infra/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findUser(signname: string) {
    return this.userRepository.findUser(signname);
  }

  async checkDuplicatedSignname(signname: string) {
    await this.userRepository.duplicateUser(signname);
    return true;
  }

  async checkDuplicatedEmail(email: string) {
    return await this.userRepository.checkDuplicatedEmail(email);
  }

  async checkDuplicatedPhone(phone: string) {
    return await this.userRepository.checkDuplicatedPhone(phone);
  }
}
