import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from "./entity/user.entity";
import { CreateUserDto } from './dto/create-user.dto';
import { GetContactsDto } from './dto/get-contacts.dto';
import { Contact } from './entity/contact.entity';
import { GetCommonContactsDto } from './dto/get-common-contacts.dto';

jest.mock('./users.service');

describe('UsersController', () => {
    let usersController: UsersController;
    let usersService: UsersService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        usersController = module.get<UsersController>(UsersController);
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
                "Phone": "222222222"
            }
            jest.spyOn(usersService, 'create').mockImplementation(() => Promise.resolve(result));
            expect(await usersController.createUser(createUserDto)).toBe(result);
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
            jest.spyOn(usersService, 'addContacts').mockImplementation(() => Promise.resolve(result));
            expect(await usersController.addContacts("222222222", getContactDto)).toBe(result);
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