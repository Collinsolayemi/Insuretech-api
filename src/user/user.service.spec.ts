import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PendingPolicyService } from 'src/pending_policy/pending_policy.service';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PendingPolicyService],
      imports: [SequelizeModule.forRoot({
        dialect: 'postgres',
        host: 'localhost',
        username: 'testuser',
        password: 'password',
        database: 'testdb',
        models: [User],
      })],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
