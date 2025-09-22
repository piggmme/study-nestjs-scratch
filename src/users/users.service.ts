import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    // TypeORM의 Repository.create() 메서드가 User 엔티티 타입을 알 수 있는 이유:
    // 1. Repository<User>에서 <User> 제네릭 타입이 User 엔티티를 명시
    // 2. TypeORM의 Repository<T>.create() 메서드는 T 타입의 인스턴스를 반환
    // 3. NestJS의 @InjectRepository(User)가 User 엔티티에 대한 Repository를 생성할 때
    //    User 엔티티의 메타데이터를 내부적으로 보관
    // 4. create() 호출 시 보관된 User 엔티티 정보를 사용하여 User 인스턴스 생성
    // 5. TypeScript 컴파일러가 제네릭 타입을 통해 타입 안전성 보장
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne({ where: { id } });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(user);
  }
}
