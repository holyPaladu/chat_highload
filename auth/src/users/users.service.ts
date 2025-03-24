import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async userExists(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
  async userVerifiedEmail(email: string): Promise<void> {
    const user = await this.userExists(email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    await this.userRepository.update(user.id, {
      verified: { ...user.verified, email: true },
    });
  }

  async createUser(body: CreateUserDto): Promise<User> {
    const { name, email, password } = body;
    const hashedPassword = await this.hashPassword(password);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }
}
