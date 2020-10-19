import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from "./entity/user.entity";
import { CreateUserDto } from './dto/create-user.dto';
import { GetContactsDto } from './dto/get-contacts.dto';
import { Contact } from './entity/contact.entity';
import { GetCommonContactsDto } from './dto/get-common-contacts.dto';
import { HttpModule, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import * as NEUTRINO_CONFIG from '../../neutrino-config.json'
import { of } from 'rxjs';

jest.mock('./users.service');

describe('UsersController', () => {
    let usersController: UsersController;
    let usersService: UsersService;
    let httpService: HttpService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService],
            imports: [HttpModule]
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        usersController = module.get<UsersController>(UsersController);
        httpService = module.get<HttpService>(HttpService);
    });

    describe('createUser', () => {
        it('shouldReturnCreatedUser', async () => {
            const result = new User();
            result.phone = "222222222";
            result.name = "Julio";
            result.lastName = "Gracia"
            const createUserDto: CreateUserDto = {
                "name": "Julio",
                "lastName": "Gracia",
                "phone": "222222222"
            }

            const response: AxiosResponse<any> = {
                data: { "valid": true },
                headers: {},
                config: { url: NEUTRINO_CONFIG['url'] },
                status: 200,
                statusText: 'OK',
            };

            jest.spyOn(httpService, "post").mockImplementation(() => of(response))
            jest.spyOn(usersService, 'create').mockImplementation(() => Promise.resolve(result));
            expect(await usersController.createUser(createUserDto)).toBe(result);
        });

        it('shouldRespond400IfPhoneIsNotValid', async () => {
            const createUserDto: CreateUserDto = {
                "name": "Julio",
                "lastName": "Gracia",
                "phone": "222222222"
            }

            const response: AxiosResponse<any> = {
                data: { "valid": false },
                headers: {},
                config: { url: NEUTRINO_CONFIG['url'] },
                status: 200,
                statusText: 'OK',
            };

            jest.spyOn(httpService, "post").mockImplementation(() => of(response))
            try {
                await usersController.createUser(createUserDto);
                fail();
            } catch (error) {
                expect(error.status).toBe(400);
                expect(error.message).toBe('Phone is invalid');
            }
        });
    });

    describe('addContact', () => {
        it('shouldReturnUserWithContacts', async () => {
            const result = new User();
            result.phone = "222222222";
            result.name = "Julio";
            result.lastName = "Gracia"

            const contact1 = new Contact();
            contact1.phone = "000000000";
            contact1.contactName = "Contact1";

            const contact2 = new Contact();
            contact2.phone = "000000001";
            contact2.contactName = "Contact2";

            result.contacts = [contact1, contact2]

            const getContactDto: GetContactsDto[] = [
                {
                    "contactName": "Contact1",
                    "phone": "000000000"
                },
                {
                    "contactName": "Contact2",
                    "phone": "000000001"
                }
            ]

            const response: AxiosResponse<any> = {
                data: { "valid": true },
                headers: {},
                config: { url: NEUTRINO_CONFIG['url'] },
                status: 200,
                statusText: 'OK',
            };

            jest.spyOn(httpService, "post").mockImplementation(() => of(response))

            jest.spyOn(usersService, 'addContacts').mockImplementation(() => Promise.resolve(result));
            expect(await usersController.addContacts("222222222", getContactDto)).toBe(result);
        });

        it('shouldReturn404IfContactPhoneIsNotValid', async () => {
            const getContactDto: GetContactsDto[] = [
                {
                    "contactName": "Contact1",
                    "phone": "000000000"
                }
            ]

            const response: AxiosResponse<any> = {
                data: { "valid": false },
                headers: {},
                config: { url: NEUTRINO_CONFIG['url'] },
                status: 200,
                statusText: 'OK',
            };

            jest.spyOn(httpService, "post").mockImplementation(() => of(response))
            try {
                await usersController.addContacts("222222222", getContactDto);
                fail();
            } catch (error) {
                expect(error.status).toBe(400);
                expect(error.message).toBe('Phone is invalid');
            }
        });

        it('shouldReturn404IfAnyContactPhoneIsNotValid', async () => {
            const getContactDto: GetContactsDto[] = [
                {
                    "contactName": "Contact1",
                    "phone": "000000000"
                },
                {
                    "contactName": "Contact2",
                    "phone": "000000001"
                }
            ]

            const response: AxiosResponse<any> = {
                data: { "valid": false },
                headers: {},
                config: { url: NEUTRINO_CONFIG['url'] },
                status: 200,
                statusText: 'OK',
            };

            jest.spyOn(httpService, "post").mockImplementation(() => of(response))
            try {
                await usersController.addContacts("222222222", getContactDto);
                fail();
            } catch (error) {
                expect(error.status).toBe(400);
                expect(error.message).toBe('Phone is invalid');
            }
        });
    });

    describe('commonContacts', () => {
        it('shouldGetCommonContacts', async () => {
            const result = [new Contact()];
            result[0].phone = "000000000";
            result[0].contactName = "Contact1";

            const getCommonContactsDto: GetCommonContactsDto = {
                "userId1": "222222222",
                "userId2": "222222223"
            }
            jest.spyOn(usersService, 'getCommonContacts').mockImplementation(() => Promise.resolve(result));
            expect(await usersController.getCommonContacts(getCommonContactsDto)).toBe(result);
        });
    });

    describe('getContacts', () => {
        it('shouldGetContactsForAGivenUser', async () => {
            const result = [new Contact()];
            result[0].phone = "000000000";
            result[0].contactName = "Contact1";

            jest.spyOn(usersService, 'getContacts').mockImplementation(() => Promise.resolve(result));
            expect(await usersController.getContacts("222222222")).toBe(result);
        });
    });
});