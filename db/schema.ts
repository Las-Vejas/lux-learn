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

export const courseSections = sqliteTable("course_sections", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  createdAt: integer("created_at", { mode: "timestamp"})
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});


export const courseUnits = sqliteTable("course_units", {
  id: text("id").primaryKey(),
  sectionId: text("section_id")
    .notNull()
    .references(() => courseSections.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const lessons = sqliteTable("lessons", {
  id: text("id").primaryKey(),
  unitId: text("unit_id")
    .notNull()
    .references(() => courseUnits.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  level: integer("level").notNull().default(1),
  order: integer("order").notNull(),
  xpReward: integer("xp_reward").notNull().default(10),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const lessonSteps = sqliteTable("lesson_steps", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  flashcardId: text("flashcard_id").references(() => flashcards.id, {
    onDelete: "set null",
  }),
  type: text("type", {
    enum: [
      "teach",
      "multiple_choice",
      "translate_to_english",
      "translate_to_lux",
      "fill_blank",
    ],
  }).notNull(),
  order: integer("order").notNull(),
  prompt: text("prompt").notNull(),
  content: text("content"),
  answer: text("answer"),
  choices: text("choices", { mode: "json" }).$type<string[]>(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const userLessonProgress = sqliteTable(
  "user_lesson_progress",
  {
    id: text("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    status: text("status", {
      enum: ["not_started", "in_progress", "complete"],
    })
      .notNull()
      .default("not_started"),
    currentStepOrder: integer("current_step_order").notNull().default(0),
    correctCount: integer("correct_count").notNull().default(0),
    wrongCount: integer("wrong_count").notNull().default(0),
    completedAt: integer("completed_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("user_lesson_progress_user_lesson_idx").on(
      table.clerkUserId,
      table.lessonId
    ),
  ]
);

export const userLessonAttempts = sqliteTable("user_lesson_attempts", {
  id: text("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  lessonStepId: text("lesson_step_id")
    .notNull()
    .references(() => lessonSteps.id, { onDelete: "cascade" }),
  answer: text("answer"),
  isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});
