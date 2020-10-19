import { Body, Controller, Delete, Get, HttpException, HttpService, HttpStatus, Param, Post } from '@nestjs/common';
import { Contact } from 'src/users/entity/contact.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GetCommonContactsDto } from './dto/get-common-contacts.dto';
import { AddContactsDto } from './dto/add-contacts.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import * as NEUTRINO_CONFIG from '../../neutrino-config.json'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly httpService: HttpService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    let isValid = await this.checkIfIsPhoneValid(createUserDto.phone);
    if(!isValid){
      throw new HttpException('Phone is invalid', HttpStatus.BAD_REQUEST)
    }
    return this.usersService.create(createUserDto);
  }

  @Post(':id/contacts')
  async addContacts(@Param('id') id: string, @Body() addContactsDto: AddContactsDto[]): Promise<User> {
    let phoneValidPromises = addContactsDto.map((contactDto) => contactDto.phone).map((phone) => this.checkIfIsPhoneValid(phone));
    return Promise.all(phoneValidPromises).then((isValidArray) => {
      if(!isValidArray.every((isValid) => isValid)){
        throw new HttpException('Phone is invalid', HttpStatus.BAD_REQUEST)
      }
      return this.usersService.addContacts(id, addContactsDto);
    })
  }
  

  @Post('commonContacts')
  getCommonContacts(@Body() getCommonContactsDto: GetCommonContactsDto): Promise<Contact[]> {
    return this.usersService.getCommonContacts(getCommonContactsDto);
  }

  @Get(':id/contacts')
  getContacts(@Param('id') id: string): Promise<Contact[]> {
    return this.usersService.getContacts(id);
  }

  async checkIfIsPhoneValid(phone: string):Promise<boolean> {
    let neutrinoCall = await this.httpService
    .post(NEUTRINO_CONFIG['url'],
    {
      number: phone
    },
    {
      headers: NEUTRINO_CONFIG['headers']
    }).toPromise();
    return neutrinoCall.data['valid'];
  }
}
