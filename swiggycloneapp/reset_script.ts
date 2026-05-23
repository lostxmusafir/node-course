import { UserController } from './src/controllers/UserController';
import mongoose from 'mongoose';
import { getEnvironmentVariables } from './src/environments/environments';

async function runReset() {
  try {
    // Connect to DB
    const env = getEnvironmentVariables();
    await mongoose.connect(env.db_url);
    console.log('Connected to DB');

    // Simulate Request/Response
    const req = {
      body: {
        email: 'rajagamer8@gmail.com',
        otp: '730115',
        new_password: '39039039'
      }
    } as any;

    const res = {
      status: (code: number) => ({
        send: (data: any) => console.log(`Response ${code}:`, data),
        json: (data: any) => console.log(`Response ${code}:`, data)
      })
    } as any;

    await UserController.resetPasswordWithOtp(req, res);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

runReset();
