import { Request, Response } from 'express';
import { ItemModel } from '../models/Item';
import { Utils } from '../utils/Utils';

export class ItemController {
  static async addItem(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).send({
          message: 'Item image is required',
        });
      }
      const { restaurant_id, category_id, name, description, price, veg, status } = req.body;
      const path = Utils.sanitizePath(req.file.path);

      const item = new ItemModel({
        restaurant_id,
        category_id,
        name,
        description,
        image: path,
        price,
        veg,
        status,
      });

      const result = await item.save();

      return res.status(200).send(result);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to add item',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async getMenuItemsByRestaurant(req: Request, res: Response) {
    try {
      const { restaurant_id } = req.params;

      const items = await ItemModel.find({
        restaurant_id,
        status: true,
      }).populate('category_id');

      return res.status(200).send(items);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to get items',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async getItems(req: Request, res: Response) {
    try {
      const items = await ItemModel.find().populate('restaurant_id category_id');

      return res.status(200).send(items);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to get items',
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
