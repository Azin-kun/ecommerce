import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/user.schema';
import { Product } from '../product/product.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }])
  products: mongoose.Types.ObjectId[];

  @Prop({ required: true })
  totalAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
