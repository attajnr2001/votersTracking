import mongoose from 'mongoose';
import GroupMember from './models/GroupMember.js'; // Adjust the path as needed
import dotenv from 'dotenv';

dotenv.config();

const resetVoterIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const result = await GroupMember.updateMany(
      {},
      { $set: { voterId: "" } }
    );

    console.log(`Updated ${result.modifiedCount} documents`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

resetVoterIds();