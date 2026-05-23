import { Request, Response } from 'express';
import { BannerModel } from '../models/Banner';
import { Utils } from '../utils/Utils';

export class BannerController {
  static async addBanner(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).send({
          message: 'Banner image is required',
        });
      }
      const path = Utils.sanitizePath(req.file.path);
      const banner = new BannerModel({
        banner: path,
      });

      const result = await banner.save();

      return res.status(200).send(result);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to add banner',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async getBanners(req: Request, res: Response) {
    try {
      const banners = await BannerModel.find({ status: true });

      return res.status(200).send(banners);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to get banners',
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
