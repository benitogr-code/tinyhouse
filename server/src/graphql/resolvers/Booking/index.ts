import { IResolvers } from "apollo-server-express";
import { Booking, Listing, Database } from "../../../lib/types";

export const bookingResolvers: IResolvers = {
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toString();
    },
    listing: async (booking: Booking, args: {}, context: { db: Database }): Promise<Listing|null> => {
      const { db } = context;
      return await db.listings.findOne({ id: booking.listing });
    }
  }
};
