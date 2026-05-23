import { Request, Response } from 'express';
import { CategoryModel } from '../models/Category';
import { Utils } from '../utils/Utils';

export class CategoryController {
  static async addCategory(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).send({
          message: 'Category image is required',
        });
      }
      const name = req.body.name;
      const status = req.body.status;
      const path = Utils.sanitizePath(req.file.path);

      const category = new CategoryModel({
        name,
        image: path,
        status,
      });

      const result = await category.save();

      return res.status(200).send(result);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to add category',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryModel.find();

      return res.status(200).send(categories);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to get categories',
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
