import { IResolvers } from "apollo-server-express";
import { Request } from "express";
import { Database, User } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import {
  UserArgs, UserBookingsArgs, UserBookingsData, UserListingsArgs, UserListingsData,
} from "./types";

export const userResolvers: IResolvers = {
  Query: {
    user: async (
      _root: undefined,
      args: UserArgs,
      context: { req: Request; db: Database }
    ): Promise<User> => {
      const { db, req } = context;
      const user = await db.users.findOne({ _id: args.id });

      if (!user) {
        throw new Error(`Failed to find user ${args.id}`);
      }

      const viewer = await authorize(req, db);
      if (viewer && viewer._id === user._id) {
        user.authorized = true;
      }

      return user;
    }
  },
  User: {
    id: (user: User) => { return user._id; },
    hasWallet: (user: User) => { return user.walletId ? true: false; },
    income: (user: User) => { return user.authorized ? user.income : null; },
    bookings: async (
      user: User,
      args: UserBookingsArgs,
      context: { db: Database }
    ): Promise<UserBookingsData|null> => {
      try {
        if (!user.authorized)
          return null;

        const data: UserBookingsData = {
          total: 0,
          result: [],
        };

        const { db } = context;
        const cursor = await db.bookings.find({ _id: { $in: user.bookings } });

        cursor.skip(args.page > 0 ? (args.page - 1) * args.limit : 0);
        cursor.limit(args.limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      }
      catch (error) {
        throw new Error(`Failed to query user bookings: ${error.message}`);
      }
    },
    listings: async (
      user: User,
      args: UserListingsArgs,
      context: { db: Database }
    ): Promise<UserListingsData|null> => {
      try {
        const data: UserListingsData = {
          total: 0,
          result: [],
        };

        const { db } = context;
        const cursor = await db.listings.find({ _id: { $in: user.listings } });

        cursor.skip(args.page > 0 ? (args.page - 1) * args.limit : 0);
        cursor.limit(args.limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      }
      catch (error) {
        throw new Error(`Failed to query user listings: ${error.message}`);
      }
    }
  }
}
