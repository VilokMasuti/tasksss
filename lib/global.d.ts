// global.d.ts
import { Mongoose } from 'mongoose';

declare global {
  let  mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

export {};
