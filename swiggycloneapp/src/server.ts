import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as path from 'path';
import * as fs from 'fs';
import { setServers } from 'dns';
import { getEnvironmentVariables } from './environments/environments';
import UserRouter from './routers/UserRouter';
import BannerRouter from './routers/BannerRouter';
import CityRouter from './routers/CityRouter';
import CategoryRouter from './routers/CategoryRouter';
import RestaurantRouter from './routers/RestaurantRouter';
import ItemRouter from './routers/ItemRouter';
import AddressRouter from './routers/AddressRouter';
import OrderRouter from './routers/OrderRouter';

export class Server {
  public app: express.Application = express();

  constructor() {
    this.setConfig();
    setServers(['8.8.8.8', '1.1.1.1']);
    this.connectMongoDB();
    this.setRoutes();
  }

  setConfig() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    this.app.use('/uploads', express.static(uploadsDir));
  }

  connectMongoDB() {
    const env = getEnvironmentVariables();

    mongoose
      .connect(env.db_url)
      .then(() => {
        console.log('✅ MongoDB connected');
      })
      .catch((error: unknown) => {
        console.log('❌ MongoDB connection error:', error);
      });
  }

  setRoutes() {
    this.app.use('/api/user', UserRouter);
    this.app.use('/api/banner', BannerRouter);
    this.app.use('/api/city', CityRouter);
    this.app.use('/api/category', CategoryRouter);
    this.app.use('/api/restaurant', RestaurantRouter);
    this.app.use('/api/item', ItemRouter);
    this.app.use('/api/address', AddressRouter);
    this.app.use('/api/order', OrderRouter);

    this.app.use((req: express.Request, res: express.Response) => {
      res.status(404).send({
        statusCode: 404,
        message: 'Route not found',
      });
    });
  }
}
