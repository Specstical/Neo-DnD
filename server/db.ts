import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/neo-dnd';
export default async function connectDB() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri);
  console.log('MongoDB connected');
} 