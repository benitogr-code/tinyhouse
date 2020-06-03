import stripe from "stripe";

const { STRIPE_CLIENT_ID, STRIPE_SECRET } = process.env;

const client = new stripe(`${STRIPE_SECRET}`, { apiVersion: "2020-03-02" });

export const Stripe = {
  connect: async (code: string) => {
    const res = await client.oauth.token({
      // eslint-disable-next-line @typescript-eslint/camelcase
      grant_type: "authorization_code",
      code,
    });

    if (!res) {
      throw new Error("Failed to connect with Stripe");
    }

    return res;
  },
  disconnect: async (stripeUserId: string) => {
    /* eslint-disable @typescript-eslint/camelcase */
    const response = await client.oauth.deauthorize({
      client_id: `${STRIPE_CLIENT_ID}`,
      stripe_user_id: stripeUserId
    });
    /* eslint-enable @typescript-eslint/camelcase */

    return response;
  },
  charge: async (amount: number, source: string, stripeAccount: string) => {
    /* eslint-disable @typescript-eslint/camelcase */
    const res = await client.charges.create({
      amount,
      currency: "usd",
      source,
      application_fee_amount: Math.round(amount * 0.05),
    },{
      stripeAccount,
    });
    /* eslint-enable @typescript-eslint/camelcase */

    if (res.status !== "succeeded") {
      throw new Error("Failed to create stripe charge");
    }
  }
};
