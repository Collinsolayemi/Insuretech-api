import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Plan } from './entities/plan.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { PendingPolicy } from 'src/pending_policy/entities/pending_policy.entity';

@Module({
  imports: [SequelizeModule.forFeature([Plan, Product, PendingPolicy, User])],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
