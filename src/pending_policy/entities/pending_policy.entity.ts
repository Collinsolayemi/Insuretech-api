// entities/pending-policy.entity.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DeletedAt,
} from 'sequelize-typescript';
import { Plan } from 'src/plan/entities/plan.entity';
import { User } from 'src/user/entities/user.entity';

@Table({ paranoid: true }) // soft delete functionality
export class PendingPolicy extends Model {
  @Column
  policyNumber: string;

  @Column
  status: string;

  @ForeignKey(() => Plan)
  @Column
  planId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @DeletedAt
  @Column
  deletedAt: Date;
}
