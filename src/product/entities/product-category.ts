import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from './product.entity';

export enum ProductCategoryType {
  HEALTH = 'Health',
  AUTO = 'Auto',
}

@Table({ tableName: 'product_categories' })
export class ProductCategory extends Model<ProductCategory> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProductCategoryType)),
    allowNull: false,
    defaultValue: ProductCategoryType.HEALTH, 
  })
  type: ProductCategoryType;
  

  @HasMany(() => Product)
  products: Product[];
}
