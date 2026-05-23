import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';

export class OrderController {
  static async placeOrder(req: Request, res: Response) {
    try {
      const user_id = (req as any).user.user_id;
      const { restaurant_id, items, total, address } = req.body;

      const order = new OrderModel({
        user_id,
        restaurant_id,
        items,
        total,
        address,
      });

      const result = await order.save();

      return res.status(200).send(result);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to place order',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async getUserOrders(req: Request, res: Response) {
    try {
      const user_id = (req as any).user.user_id;

      const orders = await OrderModel.find({ user_id })
        .populate('restaurant_id', 'name image address')
        .populate('items.item_id', 'name image price')
        .sort({ created_at: -1 });

      return res.status(200).send(orders);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to get orders',
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
