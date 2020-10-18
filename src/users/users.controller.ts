import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Contact } from 'src/users/entity/contact.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GetCommonContactsDto } from './dto/get-common-contacts.dto';
import { GetContactsDto } from './dto/get-contacts.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Post(':id/contacts')
  addContacts(@Param('id') id: string, @Body() getContactsDto: GetContactsDto[]): Promise<User> {
    return this.usersService.addContacts(id, getContactsDto);
  }

  @Post('commonContacts')
  getCommonContacts(@Body() getCommonContactsDto: GetCommonContactsDto): Promise<Contact[]> {
    return this.usersService.getCommonContacts(getCommonContactsDto);
  }

  @Get(':id/contacts')
  getContacts(@Param('id') id: string): Promise<Contact[]> {
    return this.usersService.getContacts(id);
  }

  /*****/

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
