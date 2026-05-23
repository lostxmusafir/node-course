import { UserModel } from './src/models/User';
import mongoose from 'mongoose';
import { getEnvironmentVariables } from './src/environments/environments';

async function deleteUsers() {
  try {
    const env = getEnvironmentVariables();
    await mongoose.connect(env.db_url);
    console.log('Connected to DB');

    const ids = ['6a0ca5f700d199775fdd156e', '6a0ca651934619947ec11d5c', '6a0ca67b934619947ec11d5d'];

    for (const id of ids) {
      const result = await UserModel.findByIdAndDelete(id);
      if (result) {
        console.log(`Successfully deleted user: ${id}`);
      } else {
        console.log(`User not found: ${id}`);
      }
    }
    
    await mongoose.disconnect();
    console.log('Disconnected from DB');
  } catch (error) {
    console.error('Error:', error);
  }
}

deleteUsers();
