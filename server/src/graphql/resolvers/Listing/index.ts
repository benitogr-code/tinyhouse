import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Database, Listing } from "../../../lib/types";

export const listingResolvers: IResolvers = {
  Query: {
    listings: async (
      _root: undefined,
      _args: {},
      ctx: { db: Database }
    ): Promise<Listing[]> => {
      const { db } = ctx;
      return await db.listings.find({}).toArray();
    }
  },
  Mutation: {
    deleteListing: async (
      _root: undefined,
      args: { id: string },
      ctx: { db: Database }
    ): Promise<Listing> => {
      const { id } = args;
      const { db } = ctx;

      const deleteResult = await db.listings.findOneAndDelete({ _id: new ObjectId(id) });

      if (!deleteResult.value) {
        throw new Error("deleteListing: item not found");
      }

      return deleteResult.value;
    }
  },
  Listing: {
    id: (listing: Listing): string => listing._id.toString()
  }
};
