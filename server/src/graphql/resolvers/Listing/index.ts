import { IResolvers } from "apollo-server-express";
import { Request } from "express";
import { ObjectId } from "mongodb";
import {
  ListingArgs, ListingBookingsArgs, ListingBookingsData, ListingsArgs, ListingsData, ListingsFilters
} from "./types";
import { Database, Listing, User } from "../../../lib/types";
import { authorize } from "../../../lib/utils";

export const listingResolvers: IResolvers = {
  Query: {
    listing: async (
      _root: undefined,
      args: ListingArgs,
      context: { db: Database; req: Request }
    ): Promise<Listing> => {
      const { db, req } = context;
      const listing = await db.listings.findOne({ _id: new ObjectId(args.id) })

      if (!listing) {
        throw new Error(`Listing could not be found (${args.id})`);
      }

      const viewer = await authorize(req, db);
      if (viewer && viewer._id == listing.host) {
        listing.authorized = true;
      }

      return listing;
    },
    listings: async (
      _root: undefined,
      args: ListingsArgs,
      context: { db: Database }
    ): Promise<ListingsData> => {
      try {
        const data: ListingsData = {
          total: 0,
          result: [],
        };

        const { db } = context;
        let cursor = await db.listings.find({});

        if (args.filter === ListingsFilters.PriceHighest) {
          cursor = cursor.sort({ price: -1 });
        }
        else if (args.filter === ListingsFilters.PriceLowest) {
          cursor = cursor.sort({ price: 1 });
        }

        cursor.skip(args.page > 0 ? (args.page - 1) * args.limit : 0);
        cursor.limit(args.limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      }
      catch (error) {
        throw new Error(`Failed to query listings: ${error.message}`);
      }
    }
  },
  Listing: {
    id: (listing: Listing): string => {
      return listing._id.toString();
    },
    bookings: async (
      listing: Listing,
      args: ListingBookingsArgs,
      context: { db: Database }
    ): Promise<ListingBookingsData|null> => {
      try {
        if (!listing.authorized)
          return null;

        const data: ListingBookingsData = {
          total: 0,
          result: [],
        };

        const { db } = context;
        const cursor = await db.bookings.find({ _id: { $in: listing.bookings } });

        cursor.skip(args.page > 0 ? (args.page - 1) * args.limit : 0);
        cursor.limit(args.limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      }
      catch (error) {
        throw new Error(`Failed to query listing bookings: ${error.message}`);
      }
    },
    bookingsIndex: (listing: Listing): string => {
      return JSON.stringify(listing.bookingsIndex);
    },
    host: async (listing: Listing, args: {}, context: { db: Database }): Promise<User> => {
      const { db } = context;
      const host = await db.users.findOne({ _id: listing.host });

      if (!host) {
        throw new Error("Could not find listing's host");
      }

      return host;
    }
  }
};
