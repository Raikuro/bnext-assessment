import { HttpModule, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/entity/user.entity'
import { Contact } from '../src/users/entity/contact.entity'

describe('Users e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        HttpModule,
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Contact],
          dropSchema: true,
          synchronize: true,
          logging: false
        })]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  // it(`getContacts`, () => {
  //   return request(app.getHttpServer())
  //     .get('/users/222222222/contacts')
  //     .expect([{ phone: "000000000", contactName: "contact1" },
  //     { phone: "000000001", contactName: "contact2" }])
  //     .expect(200);
  // });

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
