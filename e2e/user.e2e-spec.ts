import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/entity/user.entity'
import { Contact } from '../src/users/entity/contact.entity'

describe('Users e2e', () => {
  const usersRepo = {
    findOne: (userId, options) => {
      const res = new User();
      res.name = "Julio";
      res.phone = "222222222";
      res.lastName = "Gracia";
      res.contacts = [
        { phone: "000000000", contactName: "contact1" },
        { phone: "000000001", contactName: "contact2" }
      ]
      return res;
    },
    save: (user: User) => {
      return user;
    }
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Contact],
          dropSchema: true,
          synchronize: true,
          logging: false
        }),
      ],
    }).overrideProvider(getRepositoryToken(User))
      .useValue(usersRepo)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`getContacts`, () => {
    return request(app.getHttpServer())
      .get('/users/222222222/contacts')
      .expect([{ phone: "000000000", contactName: "contact1" },
      { phone: "000000001", contactName: "contact2" }])
      .expect(200);
  });

  it(`createUser`, () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Accept', 'application/json')
      .send({
        name: "Julio",
        lastName: "Gracia",
        phone: "222222222"
      })
      .expect({
        name: "Julio",
        lastName: "Gracia",
        phone: "222222222"
      })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
