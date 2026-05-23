import { Request, Response } from 'express';
import { CityModel } from '../models/City';

export class CityController {
  static async addCity(req: Request, res: Response) {
    try {
      const name = req.body.name;
      const status = req.body.status;

      const city = new CityModel({
        name,
        status,
      });

      const result = await city.save();

      return res.status(200).send(result);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to add city',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async getCities(req: Request, res: Response) {
    try {
      const cities = await CityModel.find();

      return res.status(200).send(cities);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to get cities',
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
