import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from 'src/product/entities/product.entity';
import { Plan } from './entities/plan.entity';
import { User } from 'src/user/entities/user.entity';
import { PurchasePlanDto } from './dto/dto';
import { PendingPolicy } from 'src/pending_policy/entities/pending_policy.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Product) private productModel: typeof Product,
    @InjectModel(Plan) private planModel: typeof Plan,
    @InjectModel(PendingPolicy)
    private pendingPolicyModel: typeof PendingPolicy,
    @InjectModel(User) private userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  async purchasePlan(
    purchasePlanDto: PurchasePlanDto & { userId: number; productId: number },
  ) {
    const { userId, productId, quantity } = purchasePlanDto;

    const transaction = await this.sequelize.transaction();

    try {
      const product = await this.productModel.findByPk(productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const user = await this.userModel.findByPk(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const totalPrice = product.price * quantity;

      if (user.walletBalance < totalPrice) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      user.walletBalance -= totalPrice;
      await user.save({ transaction });

      const plan = await this.planModel.create(
        {
          userId: user.id,
          productId: product.id,
          totalPrice,
        },
        { transaction },
      );

      const pendingPolicies = [];
      for (let i = 0; i < quantity; i++) {
        const policyNumber = this.generatePolicyNumber();
        pendingPolicies.push({
          planId: plan.id,
          status: 'unused',
          policyNumber,
        });
      }

      await this.pendingPolicyModel.bulkCreate(pendingPolicies, {
        transaction,
      });

      await transaction.commit();

      return { message: 'Plan purchased successfully', plan };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getPendingPolicies(planId: number) {
    const plan = await this.planModel.findByPk(planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const pendingPolicies = await this.pendingPolicyModel.findAll({
      where: { planId: planId },
    });

    return pendingPolicies;
  }

  // Method to activate a pending policy
  async activatePendingPolicy(policyId: number) {
    const policy = await this.pendingPolicyModel.findByPk(policyId);

    if (!policy) {
      throw new Error('Policy not found');
    }

    if (policy.status === 'active') {
      throw new Error('Policy is already activated');
    }

    // Check if the user already has an active policy for the same plan
    const existingActivePolicy = await this.pendingPolicyModel.findOne({
      where: {
        userId: policy.userId,
        planId: policy.planId,
        status: 'active',
      },
    });

    if (existingActivePolicy) {
      throw new Error('User already has an active policy in this plan');
    }

    // Soft delete the previous unused policy if it exists for the same user and plan
    await this.pendingPolicyModel.update(
      { status: 'deleted' },
      {
        where: {
          userId: policy.userId,
          planId: policy.planId,
          status: 'unused',
        },
      },
    );

    // Activate the policy and update the status
    policy.status = 'active';
    await policy.save();

    return { message: 'Policy activated successfully', policy };
  }

  async getActivatedPolicies(planId?: number) {
    const whereClause = {
      status: 'active',
    };

    if (planId) {
      whereClause['planId'] = planId;
    }

    // Fetch the activated policies with the optional filter
    const activatedPolicies = await this.pendingPolicyModel.findAll({
      where: whereClause,
    });

    return activatedPolicies;
  }

  // Helper function to generate a random policy number
  private generatePolicyNumber() {
    return Math.random().toString(36).substr(2, 9);
  }
}
