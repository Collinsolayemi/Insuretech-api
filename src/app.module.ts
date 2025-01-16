import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductModule } from './product/product.module';
import { SeedService } from './seed.service';
import { PlanModule } from './plan/plan.module';
import { UserModule } from './user/user.module';
import { PendingPolicyModule } from './pending_policy/pending_policy.module';
import { ProductCategory } from './product/entities/product-category';
import { User } from './user/entities/user.entity';
import { Policy } from './pending_policy/entities/policy.entity';
import { Product } from './product/entities/product.entity';
import { Plan } from './plan/entities/plan.entity';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'staging',
      password: 'staging',
      database: 'insuretech',
      //autoLoadModels: true,
      synchronize: true,
      models: [ProductCategory, User, Policy, Product, Plan],
    }),
    SequelizeModule.forFeature([ProductCategory, User, Policy, Product, Plan]),
    ProductModule,
    PlanModule,
    UserModule,
    PendingPolicyModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
