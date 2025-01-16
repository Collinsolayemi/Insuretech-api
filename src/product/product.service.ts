import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GetProductDto } from './dto/get-product.dto';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/product-category';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productModel: typeof Product,
    @InjectModel(ProductCategory)
    private productCategoryModel: typeof ProductCategory,
  ) {}

  async findAll(): Promise<GetProductDto[]> {
    const products = await this.productModel.findAll({
      include: {
        model: ProductCategory,
        attributes: ['name'],
      },
    });

    return products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        categoryName: product.productCategory
          ? product.productCategory.name
          : null,
      };
    });
  }
}
