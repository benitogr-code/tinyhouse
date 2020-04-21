import { IResolvers } from "apollo-server-express";
import crypto from "crypto";
import { LogInArgs } from "./types";
import { Google } from "../../../lib/api";
import { Database, User, Viewer } from "../../../lib/types";

async function logInWithGoogle(authCode: string, userToken: string, db: Database): Promise<User|undefined> {
  const { user } = await Google.logIn(authCode);

  if (!user) {
    throw new Error("Failed to log in with Google");
  }

  const googleName = user.names ? user.names[0] : null;
  const googlePhoto = user.photos ? user.photos[0] : null;
  const googleEmail = user.emailAddresses ? user.emailAddresses[0] : null;

  const userName = googleName ? googleName.displayName : null;
  const userId = googleName && googleName.metadata && googleName.metadata.source ? googleName.metadata.source.id : null;
  const userAvatar = googlePhoto && googlePhoto.url ? googlePhoto.url : null;
  const userEmail = googleEmail && googleEmail.value ? googleEmail.value : null;

  if (!userName || !userId || !userAvatar || !userEmail) {
    throw new Error("Failed to log in with Google");
  }

  const updateResult = await db.users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token: userToken
      }
    },
    { returnOriginal: false }
  );

  if (updateResult.value)
    return updateResult.value;

  const insertResult = await db.users.insertOne({
    _id: userId,
    name: userName,
    avatar: userAvatar,
    contact: userEmail,
    token: userToken,
    income: 0,
    bookings: [],
    listings: []
  });

  return insertResult.ops[0];
}

export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: (): string => {
      try {
        return Google.authUrl;
      }
      catch(error) {
        throw new Error(`Failed to retrieve Google auth url: ${error.message}`)
      }
    }
  },
  Mutation: {
    logIn: async (_root: undefined, { input }: LogInArgs, context: { db: Database }): Promise<Viewer> => {
      try {
        const code = input ? input.code : null;
        const token = crypto.randomBytes(16).toString();

        const viewer: User | undefined = code
          ? await logInWithGoogle(code, token, context.db)
          : undefined;

        if (!viewer) {
          return { didRequest: true };
        }

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true
        }
      }
      catch(error) {
        throw new Error(`Failed to log in: ${error.message}`);
      }
    },
    logOut: (): Viewer => {
      try {
        return { didRequest: true };
      }
      catch(error) {
        throw new Error(`Failed to log out: ${error.message}`);
      }
    }
  },
  Viewer: {
    id: (viewer: Viewer): string | undefined => { return viewer._id; },
    hasWallet: (viewer: Viewer): boolean | undefined  => {
      return viewer.walletId ? true: undefined;
    }
  }
};
