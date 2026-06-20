import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const userProfiles = sqliteTable(
  "user_profiles",
  {
    id: text("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    email: text("email").notNull().unique(),
    displayName: text("display_name"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  }
);

export const flashcardDecks = sqliteTable(
  "flashcard_decks",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    type: text("type", { enum: ["preset"] }).notNull().default("preset"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  }
);

export const flashcards = sqliteTable(
  "flashcards",
  {
    id: text("id").primaryKey(),
    deckId: text("deck_id")
      .notNull()
      .references(() => flashcardDecks.id, { onDelete: "cascade" }),
    luxembourgish: text("luxembourgish").notNull(),
    english: text("english").notNull(),
    pronunciation: text("pronunciation"),
    exampleSentence: text("example_sentence"),
    audioUrl: text("audio_url"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  }
);

export const userFlashcardProgress = sqliteTable(
  "user_flashcard_progress",
  {
    id: text("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    flashcardId: text("flashcard_id")
      .notNull()
      .references(() => flashcards.id, { onDelete: "cascade" }),
    correctCount: integer("correct_count").notNull().default(0),
    wrongCount: integer("wrong_count").notNull().default(0),
    masteryLevel: integer("mastery_level").notNull().default(0),
    lastAnsweredAt: integer("last_answered_at", { mode: "timestamp" }),
    nextReviewAt: integer("next_review_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("user_flashcard_progress_user_card_idx").on(
      table.clerkUserId,
      table.flashcardId
    ),
  ]
);

export const flashcardDeckRelations = relations(flashcardDecks, ({ many }) => ({
  flashcards: many(flashcards),
}));

export const flashcardRelations = relations(flashcards, ({ one, many }) => ({
  deck: one(flashcardDecks, {
    fields: [flashcards.deckId],
    references: [flashcardDecks.id],
  }),
  progress: many(userFlashcardProgress),
}));

export const userFlashcardProgressRelations = relations(
  userFlashcardProgress,
  ({ one }) => ({
    flashcard: one(flashcards, {
      fields: [userFlashcardProgress.flashcardId],
      references: [flashcards.id],
    }),
  })
);
