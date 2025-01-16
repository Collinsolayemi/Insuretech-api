import { Module } from '@nestjs/common';
import { PendingPolicyService } from './pending_policy.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PendingPolicy } from './entities/pending_policy.entity';
import { Policy } from './entities/policy.entity';

@Module({
  imports: [SequelizeModule.forFeature([PendingPolicy, Policy])],
  controllers: [],
  providers: [PendingPolicyService],
})
export class PendingPolicyModule {}
