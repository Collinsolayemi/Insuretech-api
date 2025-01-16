import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create a user
  @Post('create')
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  // Buy a plan (deduct from wallet)
  @Post(':userId/buy-plan')
  async buyPlan(
    @Param('userId') userId: string,
    @Body() body: { totalAmount: number },
  ) {
    return this.userService.buyPlan(userId, body.totalAmount);
  }

  // Get wallet balance
  @Get(':userId/wallet')
  async getWalletBalance(@Param('userId') userId: string) {
    return this.userService.getWalletBalance(userId);
  }
}
