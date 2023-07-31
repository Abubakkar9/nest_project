import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}

  //Adding user to the database
  async create(createUserDto: CreateUserDto) : Promise<User> {

    let user: User = new User()
    user.call_sid = createUserDto.call_sid
    user.duration = createUserDto.duration
    user.status = createUserDto.status

    if(createUserDto.media_url) {
      user.media_url = createUserDto.media_url
    }
    else{
      user.media_url = ""
    }

    return this.userRepository.save(user)
  }

  findAll() : Promise<User[]> {
    return this.userRepository.find()
  }

  findOne(id: number) {
    return this.userRepository.findOne({where: { id }})
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    let user: User = new User()
    user.call_sid = updateUserDto.call_sid
    user.duration = updateUserDto.duration
    user.status = updateUserDto.status
    user.id = id
    return this.userRepository.save(user)
  }

  remove(id: number) {
    return this.userRepository.delete(id)
  }
}
