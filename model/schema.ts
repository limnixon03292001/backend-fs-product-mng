import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  serial,
} from "drizzle-orm/pg-core";

export const productTable = pgTable("product", {
  id: serial().primaryKey(),
  productName: varchar({ length: 200 }).notNull(),
  price: integer().notNull(),
  description: varchar({ length: 300 }).notNull(),
});

export const userTable = pgTable("users", {
  id: serial().primaryKey(),
  email: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 100 }).notNull(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: serial().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  token: text().notNull().unique(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
});
