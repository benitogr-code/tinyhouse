import { google } from "googleapis";
import { createClient } from "@google/maps";

const {
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_GEOCODING_API_KEY, APP_PUBLIC_URL
} = process.env;

const auth = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${APP_PUBLIC_URL}/login`
);

const maps = createClient({
  key: `${GOOGLE_GEOCODING_API_KEY}`,
  Promise
});

export const Google = {
  authUrl: auth.generateAuthUrl({
    // eslint-disable-next-line @typescript-eslint/camelcase
    access_type: "online",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ]
  }),
  logIn: async (code: string) => {
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);

    const { data } = await google.people({ version: "v1", auth }).people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos"
    });

    return { user: data };
  },
  geocode: async (address: string) => {
    const res = await maps.geocode({ address }).asPromise();

    if ((res.status < 200) || (res.status > 299)) {
      throw new Error("Failed to geocode address");
    }

    const addressComponents = res.json.results[0].address_components;

    let country = null;
    let admin = null;
    let city = null;

    for (const component of addressComponents) {
      if (component.types.includes("country")) {
        country = component.long_name;
      }

      if (component.types.includes("administrative_area_level_1")) {
        admin = component.long_name;
      }

      if (component.types.includes("locality") || component.types.includes("postal_town")) {
        city = component.long_name;
      }
    }

    return {
      country,
      admin,
      city
    };
  }
};
