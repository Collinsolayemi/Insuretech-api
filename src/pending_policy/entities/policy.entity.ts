import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Table({ tableName: 'policies' })
export class Policy extends Model<Policy> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string; 

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  policyName: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  productId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  policyNumber: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  activatedAt: Date;
}
