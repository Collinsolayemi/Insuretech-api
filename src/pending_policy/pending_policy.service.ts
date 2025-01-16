import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PendingPolicy } from './entities/pending_policy.entity';
import { Policy } from './entities/policy.entity';
import { ActivatePolicyDto } from './dto/dto';

@Injectable()
export class PendingPolicyService {
  constructor(
    @InjectModel(PendingPolicy)
    private pendingPolicyModel: typeof PendingPolicy,
    @InjectModel(Policy) private policyModel: typeof Policy,
  ) { }
  
  async createPolicy(userId: string, productId: string, policyNumber: string): Promise<Policy> {
    const policy = await this.policyModel.create({
      userId,
      // productId,
      policyNumber,
      //isActive: false,
    });
    return policy;
  }

  async activatePolicy(activatePolicyDto: ActivatePolicyDto) {
    const { userId, policyId } = activatePolicyDto;

    // Find the pending policy
    const pendingPolicy = await this.pendingPolicyModel.findOne({
      where: {
        id: policyId,
        status: 'unused', // Only unused policies can be activated
      },
    });

    if (!pendingPolicy) {
      throw new Error('Pending policy not found or already activated');
    }

    // Check if the user is the same as the one who purchased the plan
    // if (pendingPolicy.plan.userId !== userId) {
    //   throw new Error('You cannot activate a policy for another user');
    // }

    // Create the activated policy
    const activatedPolicy = await this.policyModel.create({
      // userId: userId,
      // productId: pendingPolicy.plan.productId,
      // policyNumber: pendingPolicy.policyNumber,
      // activatedAt: new Date(),
    });

    // Mark the pending policy as used (soft delete it)
    pendingPolicy.status = 'used';
    await pendingPolicy.save();

    return {
      message: 'Policy activated successfully',
      policy: activatedPolicy,
    };
  }

  async getActivatedPoliciesByPlan(productId: string): Promise<Policy[]> {
    return this.policyModel.findAll({
      where: {
        // productId,
        // isActive: true,
      },
    });
  }
}
