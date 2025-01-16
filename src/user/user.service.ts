import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from './entities/user.entity';
import { PendingPolicyService } from 'src/pending_policy/pending_policy.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly policyService: PendingPolicyService,
  ) {}

  // Create or get a user
  async createUser(dto: CreateUserDto): Promise<User> {
    return this.userModel.create(dto);
  }

  // Deduct from user's wallet when buying a plan
  async buyPlan(userId: string, totalAmount: number): Promise<User> {
    const user = await this.userModel.findByPk(userId);
    if (user.walletBalance < totalAmount) {
      throw new Error('Insufficient funds');
    }
    user.walletBalance -= totalAmount;
    return user.save();
  }

  // Add a policy to the user
  async addPolicy(
    userId: string,
    productId: string,
    policyNumber: string,
  ): Promise<void> {
    await this.policyService.createPolicy(userId, productId, policyNumber);
  }

  // Get a user's wallet balance
  async getWalletBalance(userId: string): Promise<number> {
    const user = await this.userModel.findByPk(userId);
    return user.walletBalance;
  }
}
