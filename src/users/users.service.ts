import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetCommonContactsDto } from './dto/get-common-contacts.dto';
import { User } from './entity/user.entity';
import { Contact } from './entity/contact.entity';
import { AddContactsDto } from './dto/add-contacts.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.name = createUserDto.name;
    user.lastName = createUserDto.lastName;
    user.phone = createUserDto.phone;
    return this.usersRepository.save(user);
  }

  async getContacts(userId: string): Promise<Contact[]> {
    const user = await this.usersRepository.findOne(userId, { relations: ['contacts'] });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    return user.contacts;
  }

  async addContacts(userId: string, getContactsDto: AddContactsDto[]): Promise<User> {
    const user = await this.usersRepository.findOne(userId, { relations: ['contacts'] });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    user.contacts = user.contacts ? user.contacts : []
    getContactsDto.forEach((contactDto) => {
      const contact = new Contact();
      contact.contactName = contactDto.contactName
      contact.phone = contactDto.phone;
      user.contacts.push(contact);
    })
    return this.usersRepository.save(user);
  }

  getCommonContacts(getCommonContactsDto: GetCommonContactsDto): Promise<Contact[]> {
    return this.usersRepository.query(
      'SELECT DISTINCT c.* FROM contact c, (SELECT uc1.contact FROM user_contacts uc1 LEFT JOIN user_contacts uc2 ON uc1.contact=uc2.contact WHERE uc1.user<>uc2.user AND ' +
      'uc1.user='+ getCommonContactsDto.userId1 +' AND '+
      'uc2.user='+ getCommonContactsDto.userId2 +') commonContacts WHERE commonContacts.contact=c.phone;');
  }
}
