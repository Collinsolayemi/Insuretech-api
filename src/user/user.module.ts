import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { PendingPolicyService } from 'src/pending_policy/pending_policy.service';
import { PendingPolicy } from 'src/pending_policy/entities/pending_policy.entity';
import { Policy } from 'src/pending_policy/entities/policy.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, PendingPolicy, Policy])],
  controllers: [UserController],
  providers: [UserService, PendingPolicyService],
})
export class UserModule {}
