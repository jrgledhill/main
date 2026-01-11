"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRelations = exports.productsRelations = exports.usersRelations = exports.comments = exports.products = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    name: (0, pg_core_1.text)("name"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: "date" }).notNull().defaultNow(),
});
exports.products = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: "date" })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});
exports.comments = (0, pg_core_1.pgTable)("comments", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    content: (0, pg_core_1.text)("content").notNull(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    productId: (0, pg_core_1.uuid)("product_id")
        .notNull()
        .references(() => exports.products.id, { onDelete: "cascade" }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: "date" }).notNull().defaultNow(),
});
// 🔴 Relations define how tables connect to each other. This enables Drizzle's query API
// 🔴 to automatically join related data when using `with: { relationName: true }`
// 🔴 Users Relations: A user can have many products and many comments
// 🔴 `many()` means one user can have multiple related records
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    products: many(exports.products), // 🔴 One user → many products
    comments: many(exports.comments), // 🔴 One user → many comments
}));
// Products Relations: a product belongs to one user and can have many comments
// `one()` means a single related record, `many()` means multiple related records
exports.productsRelations = (0, drizzle_orm_1.relations)(exports.products, ({ one, many }) => ({
    comments: many(exports.comments),
    // `fields` = the foreign key column in THIS table (products.userId)
    // `references` = the primary key column in the RELATED table (users.id)
    user: one(exports.users, { fields: [exports.products.userId], references: [exports.users.id] }), // one product → one user
}));
// Comments Relations: A comment belongs to one user and one product
exports.commentsRelations = (0, drizzle_orm_1.relations)(exports.comments, ({ one }) => ({
    // `comments.userId` is the foreign key,  `users.id` is the primary key
    user: one(exports.users, { fields: [exports.comments.userId], references: [exports.users.id] }), // One comment → one user
    // `comments.productId` is the foreign key,  `products.id` is the primary key
    product: one(exports.products, {
        fields: [exports.comments.productId],
        references: [exports.products.id],
    }), // One comment → one product
}));
