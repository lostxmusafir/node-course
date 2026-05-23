import { Request, Response } from 'express';
import { AddressModel } from '../models/Address';

export class AddressController {
  static async addAddress(req: Request, res: Response) {
    try {
      const user_id = (req as any).user.user_id;
      const { title, address, landmark, house_no, lat, lng } = req.body;

      const newAddress = new AddressModel({
        user_id,
        title,
        address,
        landmark,
        house_no,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });

      const result = await newAddress.save();

      return res.status(200).send(result);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to add address',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async getUserAddresses(req: Request, res: Response) {
    try {
      const user_id = (req as any).user.user_id;

      const addresses = await AddressModel.find({ user_id, status: 'active' });

      return res.status(200).send(addresses);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to get addresses',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async deleteAddress(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user_id = (req as any).user.user_id;

      const address = await AddressModel.findOneAndUpdate(
        { _id: id, user_id },
        { status: 'deleted' },
        { new: true }
      );

      if (!address) {
        return res.status(404).send({
          message: 'Address not found or already deleted',
        });
      }

      return res.status(200).send({
          message: 'Address deleted successfully',
      });
      } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to delete address',
        error: error instanceof Error ? error.message : error,
      });
      }
      }

      static async updateAddress(req: Request, res: Response) {
      try {
      const { id } = req.params;
      const user_id = (req as any).user.user_id;
      const { title, address, landmark, house_no, lat, lng } = req.body;

      const updatedAddress = await AddressModel.findOneAndUpdate(
        { _id: id, user_id },
        {
          title,
          address,
          landmark,
          house_no,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
        { new: true }
      );

      if (!updatedAddress) {
        return res.status(404).send({
          message: 'Address not found',
        });
      }

      return res.status(200).send(updatedAddress);
      } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to update address',
        error: error instanceof Error ? error.message : error,
      });
      }
      }
      }
