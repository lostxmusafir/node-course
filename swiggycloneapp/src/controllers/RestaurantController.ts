import { Request, Response } from 'express';
import { RestaurantModel } from '../models/Restaurant';
import { Utils } from '../utils/Utils';

export class RestaurantController {
  static async addRestaurant(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).send({
          message: 'Restaurant image is required',
        });
      }
      const { name, address, city_id, category_id, lat, lng, status } = req.body;
      const path = Utils.sanitizePath(req.file.path);

      const restaurant = new RestaurantModel({
        name,
        image: path,
        location: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        address,
        city_id,
        category_id,
        status,
      });

      const result = await restaurant.save();

      return res.status(200).send(result);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to add restaurant',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async getNearbyRestaurants(req: Request, res: Response) {
    try {
      const { lat, lng, radius } = req.query;
      if (!lat || !lng) {
        return res.status(400).send({
          message: 'Latitude and Longitude are required',
        });
      }
      const maxDistance = parseFloat(radius as string) || 5000; // default 5km

      const restaurants = await RestaurantModel.find({
        status: 'active',
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
            },
            $maxDistance: maxDistance,
          },
        },
      });

      return res.status(200).send(restaurants);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to get nearby restaurants',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async searchRestaurants(req: Request, res: Response) {
    try {
      const { name } = req.query;

      const restaurants = await RestaurantModel.find({
        name: { $regex: name as string, $options: 'i' },
        status: 'active',
      });

      return res.status(200).send(restaurants);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to search restaurants',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async getRestaurants(req: Request, res: Response) {
    try {
      const restaurants = await RestaurantModel.find()
        .populate('city_id', 'name')
        .populate('category_id', 'name image');

      return res.status(200).send(restaurants);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to get restaurants',
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
