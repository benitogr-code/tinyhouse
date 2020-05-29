import { IResolvers } from "apollo-server-express";
import { Request } from "express";
import { ObjectId } from "mongodb";
import { CreateBookingArgs } from "./types";
import { Stripe } from "../../../lib/api";
import { Booking, BookingsIndex, Database, Listing, User } from "../../../lib/types";
import { authorize } from "../../../lib/utils";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const resolveBookingsIndex = (bookingsIndex: BookingsIndex, checkIn: string, checkOut: string): BookingsIndex => {
  let dateCursor = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const updatedIndex: BookingsIndex = { ...bookingsIndex };

  while (dateCursor <= checkOutDate) {
    const year = dateCursor.getUTCFullYear();
    const month = dateCursor.getUTCMonth();
    const day = dateCursor.getUTCDate();

    if (!updatedIndex[year]) {
      updatedIndex[year] = {};
    }

    if (!updatedIndex[year][month]) {
      updatedIndex[year][month] = {};
    }

    if (!updatedIndex[year][month][day]) {
      updatedIndex[year][month][day] = true;
    }
    else {
      throw new Error("Selected dates cannot overlap dates which have already been booked");
    }

    dateCursor = new Date(dateCursor.getTime() + DAY_IN_MS);
  }

  return updatedIndex;
};

export const bookingResolvers: IResolvers = {
  Mutation: {
    createBooking: async (
      _root: undefined,
      args: CreateBookingArgs,
      context: { db: Database; req: Request}
      ): Promise<Booking> => {
        try {
          const { input } = args;
          const { db, req } = context;

          const viewer = await authorize(req, db);
          if (!viewer) {
            throw new Error("Viewer cannot be found");
          }

          const listing = await db.listings.findOne({ _id: new ObjectId(input.id) });
          if (!listing) {
            throw new Error("Listing cannot be found");
          }

          if (listing.host === viewer._id) {
            throw new Error("Host cannot book their own listing");
          }

          const checkInDate = new Date(input.checkIn);
          const checkOutDate = new Date(input.checkOut);

          if (checkOutDate < checkInDate) {
            throw new Error("CheckOut date cannot be before CheckIn date");
          }

          const bookingsIndex = resolveBookingsIndex(listing.bookingsIndex, input.checkIn, input.checkOut);

          const bookedDays = ((checkOutDate.getTime() - checkInDate.getTime()) / DAY_IN_MS) + 1;
          const totalPrice = Math.round(listing.price * bookedDays);

          const host = await db.users.findOne({ _id: listing.host });
          if (!host || !host.walletId) {
            throw new Error("Listing host either cannot be found or is not connected to Stripe");
          }

          await Stripe.charge(totalPrice, input.source, host.walletId);

          const insertRes = await db.bookings.insertOne({
            _id: new ObjectId(),
            listing: listing._id,
            tenant: viewer._id,
            checkIn: input.checkIn,
            checkOut: input.checkOut,
          });

          const booking: Booking = insertRes.ops[0];

          await db.users.updateOne(
            {
              _id: host._id
            },
            {
              $inc: { income: totalPrice }
            }
          );

          await db.users.updateOne(
            {
              _id: viewer._id
            },
            {
              $push: { bookings: booking._id }
            }
          );

          await db.listings.updateOne(
            {
              _id: listing._id
            },
            {
              $set: { bookingsIndex },
              $push: { bookings: booking._id}
            }
          );

          return booking;
        }
        catch (error) {
          throw new Error(`Failed to create booking: ${error.message}`)
        }
    }
  },
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toString();
    },
    listing: async (booking: Booking, args: {}, context: { db: Database }): Promise<Listing|null> => {
      const { db } = context;
      return await db.listings.findOne({ _id: booking.listing });
    },
    tenant: async (booking: Booking, args: {}, context: { db: Database }): Promise<User|null> => {
      const { db } = context;
      return await db.users.findOne({ _id: booking.tenant });
    }
  }
};
