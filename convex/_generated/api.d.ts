/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as about from "../about.js";
import type * as categories from "../categories.js";
import type * as features from "../features.js";
import type * as files from "../files.js";
import type * as header from "../header.js";
import type * as hero from "../hero.js";
import type * as http from "../http.js";
import type * as newsletter from "../newsletter.js";
import type * as partners from "../partners.js";
import type * as products from "../products.js";
import type * as reviews from "../reviews.js";
import type * as terms from "../terms.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  about: typeof about;
  categories: typeof categories;
  features: typeof features;
  files: typeof files;
  header: typeof header;
  hero: typeof hero;
  http: typeof http;
  newsletter: typeof newsletter;
  partners: typeof partners;
  products: typeof products;
  reviews: typeof reviews;
  terms: typeof terms;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
