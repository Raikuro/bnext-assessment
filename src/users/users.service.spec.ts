import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from "./entity/user.entity";
import { CreateUserDto } from './dto/create-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contact } from './entity/contact.entity';
import { AddContactsDto } from './dto/add-contacts.dto';
import { GetCommonContactsDto } from './dto/get-common-contacts.dto';

describe('UsersService', () => {
    let usersService: UsersService;
    let usersRepository: Repository<User>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UsersService, { provide: getRepositoryToken(User), useClass: Repository }]
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
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
            jest.spyOn(usersRepository, 'save').mockImplementation(() => Promise.resolve(result));
            expect(await usersService.create(createUserDto)).toBe(result);
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

            const getContactDto: AddContactsDto[] = [
                {
                    "contactName": "Contact1",
                    "phone": "000000000"
                },
                {
                    "contactName": "Contact2",
                    "phone": "000000001"
                }
            ]

            jest.spyOn(usersRepository, 'findOne').mockImplementation(() => Promise.resolve(result));
            result.contacts = [contact1, contact2]
            jest.spyOn(usersRepository, 'save').mockImplementation(() => Promise.resolve(result));
            
            expect(await usersService.addContacts("222222222", getContactDto)).toBe(result);
        });
        it('shouldReturn404IfUserNotFound', async () => {
            const getContactDto: AddContactsDto[] = [
                {
                    "contactName": "Contact1",
                    "phone": "000000000"
                },
                {
                    "contactName": "Contact2",
                    "phone": "000000001"
                }
            ]

            jest.spyOn(usersRepository, 'findOne').mockImplementation(() => Promise.resolve(undefined));

            try {
                await usersService.addContacts("222222222", getContactDto);
                fail();
            } catch (error) {
                expect(error.status).toBe(404);
                expect(error.message).toBe('User not found');
            }
        });
    });

    describe('commonContacts', () => {
        it('shouldReturnCommonContacts', async () => {
            const result = [new Contact()];
            result[0].phone = "000000000";
            result[0].contactName = "Contact1";

            const getCommonContactsDto: GetCommonContactsDto = {
                "userId1": "222222222",
                "userId2": "222222223"
            }
            jest.spyOn(usersRepository, 'query').mockImplementation(() => Promise.resolve(result));
            expect(await usersService.getCommonContacts(getCommonContactsDto)).toBe(result);
        });
    });

    describe('getContacts', () => {
        it('shouldGetContactsForAGivenUser', async () => {
            const result = new User();
            result.phone = "222222222";
            result.name = "Julio";
            result.lastName = "Gracia"

            const contact1 = new Contact();
            contact1.phone = "000000000";
            contact1.contactName = "Contact1";
            result.contacts = [contact1]

            jest.spyOn(usersRepository, 'findOne').mockImplementation(() => Promise.resolve(result));

            const expected = [new Contact()];
            expected[0].phone = "000000000";
            expected[0].contactName = "Contact1";

            expect(await usersService.getContacts("222222222")).toStrictEqual(expected);
        });

        it('shouldReturn404IfUserNotFound', async () => {
            jest.spyOn(usersRepository, 'findOne').mockImplementation(() => Promise.resolve(undefined));

            try {
                await usersService.getContacts("222222222");
                fail();
            } catch (error) {
                expect(error.status).toBe(404);
                expect(error.message).toBe('User not found');
            }
        });
    });
});