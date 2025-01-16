import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductCategory } from './product/entities/product-category';
import { Product } from './product/entities/product.entity';
import { Policy } from './pending_policy/entities/policy.entity';
import { User } from './user/entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(ProductCategory)
    private productCategoryModel: typeof ProductCategory,
    @InjectModel(Product) private productModel: typeof Product,
    @InjectModel(Policy) private policyModel: typeof Policy,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async onModuleInit() {
    const categories = [{ name: 'Health' }, { name: 'Auto' }];

    const products = [
      { name: 'Optimal care mini', price: 10000, categoryName: 'Health' },
      { name: 'Optimal care standard', price: 20000, categoryName: 'Health' },
      { name: 'Third-party', price: 5000, categoryName: 'Auto' },
      { name: 'Comprehensive', price: 15000, categoryName: 'Auto' },
    ];

    // Seed categories
    for (const category of categories) {
      await this.productCategoryModel.findOrCreate({
        where: { name: category.name },
      });
    }

    // Seed products
    for (const productData of products) {
      const category = await this.productCategoryModel.findOne({
        where: { name: productData.categoryName },
      });
      if (category) {
        await this.productModel.findOrCreate({
          where: { name: productData.name },
          defaults: {
            name: productData.name,
            price: productData.price,
            categoryId: category.id,
          },
        });
      }
    }

    const users = [
      { name: 'John Doe', walletBalance: 500 },
      { name: 'Jane Smith', walletBalance: 1000 },
      { name: 'Alex Johnson', walletBalance: 300 },
    ];

    // Seed users and their policies
    for (const userData of users) {
      const [user] = await this.userModel.findOrCreate({
        where: { name: userData.name },
        defaults: {
          name: userData.name,
          walletBalance: userData.walletBalance,
        },
      });

      // Seed policies for each user
      const policies = [
        {
          policyName: 'Health Insurance',
          userId: user.id,
          createdAt: new Date(),
        },
        {
          policyName: 'Life Insurance',
          userId: user.id,
          createdAt: new Date(),
        },
      ];

      // Create policies
      // for (const policyData of policies) {
      //   await this.policyModel.findOrCreate({
      //     where: { userId: policyData.userId, policyName: policyData.policyName },
      //     defaults: policyData,
      //   });
      // }
    }

    console.log('Database seeding completed.');
  }
}
