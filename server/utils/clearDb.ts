import { connectDatabase } from "../src/database";

async function clearDb() {
  try {
    console.log("[clearDb] running...");

    const db = await connectDatabase();

    const hasBookings = await db.bookings.countDocuments() > 0;
    const hasListings = await db.listings.countDocuments() > 0;
    const hasUsers = await db.users.countDocuments() > 0;

    if (hasBookings)
      await db.bookings.drop();

    if (hasListings)
      await db.listings.drop();

    if (hasUsers)
      await db.users.drop();

    console.log("[clearDb] finished");
  }
  catch(error) {
    throw new Error("clearDb: failed to clear database");
  }
}

clearDb();
