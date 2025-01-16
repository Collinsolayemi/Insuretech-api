import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Policy } from 'src/pending_policy/entities/policy.entity';


@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.FLOAT,
    defaultValue: 0,
    allowNull: false,
  })
  walletBalance: number;

  @HasMany(() => Policy)
  policies: Policy[];
}
