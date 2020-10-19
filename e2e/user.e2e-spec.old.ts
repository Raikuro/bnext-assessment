import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';

describe('Cats', () => {
  const usersService = { findAll: () => ['test'] };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule,
        TypeOrmModule.forRoot({
          type: "mysql",
          host: "localhost",
          port: 3306,
          username: "root",
          password: "root",
          database: "test",
          entities: ["dist/**/*.entity{.ts,.js}"],
          synchronize: true
        }),
      ],
    }).overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET users`, () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect({
        data: usersService.findAll(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
