import mongoose from 'mongoose';

export const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      'Mongoose connected to mongodb successfully on : ' + conn.connection.host
    );
  } catch (error) {
    console.log('Error on connecting to mongodb: ', error);
  }
};
