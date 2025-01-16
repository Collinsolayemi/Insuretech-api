import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PurchasePlanDto } from './dto/dto';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('purchase/:userId/:productId')
  async purchasePlan(
    @Param('userId') userId: number,
    @Param('productId') productId: number,
    @Body() purchasePlanDto: PurchasePlanDto,
  ) {
    return this.planService.purchasePlan({
      ...purchasePlanDto,
      userId,
      productId,
    });
  }

  @Get(':planId/pending-policies')
  async getPendingPolicies(@Param('planId') planId: number) {
    const pendingPolicies = await this.planService.getPendingPolicies(planId);
    return { pendingPolicies };
  }

  @Patch('pending-policies/:policyId/activate')
  async activatePendingPolicy(@Param('policyId') policyId: number) {
    const result = await this.planService.activatePendingPolicy(policyId);
    return result;
  }

  @Get('activated-policies')
  async getActivatedPolicies(@Query('planId') planId: number) {
    const policies = await this.planService.getActivatedPolicies(planId);
    return policies;
  }
}
