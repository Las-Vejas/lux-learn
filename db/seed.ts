import { loadEnvConfig } from "@next/env";
import { inArray, sql } from "drizzle-orm";

import { db } from "./index";
import {
  courseSections,
  courseUnits,
  flashcardDecks,
  flashcards,
  lessons,
  lessonSteps,
} from "./schema";

loadEnvConfig(process.cwd());

const now = sql`(unixepoch())`;

const decks = [
  {
    id: "deck_greetings",
    slug: "greetings",
    title: "Greetings",
    description: "First phrases for saying hello, goodbye, and checking in.",
  },
  {
    id: "deck_in_the_city",
    slug: "in-the-city",
    title: "In the city",
    description: "Useful words for streets, shops, stations, and directions.",
  },
  {
    id: "deck_food_drink",
    slug: "food-and-drink",
    title: "Food and drink",
    description: "Order basics for cafés, snacks, and everyday meals.",
  },
];

const cards = [
  {
    id: "card_greetings_moien",
    deckId: "deck_greetings",
    luxembourgish: "Moien",
    english: "Hello",
    pronunciation: "moy-en",
    exampleSentence: "Moien, wéi geet et?",
  },
  {
    id: "card_greetings_addi",
    deckId: "deck_greetings",
    luxembourgish: "Äddi",
    english: "Goodbye",
    pronunciation: "ah-dee",
    exampleSentence: "Äddi, bis geschwënn.",
  },
  {
    id: "card_greetings_merci",
    deckId: "deck_greetings",
    luxembourgish: "Merci",
    english: "Thank you",
    pronunciation: "mehr-see",
    exampleSentence: "Merci fir deng Hëllef.",
  },
  {
    id: "card_greetings_wei_geet_et",
    deckId: "deck_greetings",
    luxembourgish: "Wéi geet et?",
    english: "How are you?",
    pronunciation: "vay gate et",
    exampleSentence: "Moien, wéi geet et haut?",
  },
  {
    id: "card_city_stad",
    deckId: "deck_in_the_city",
    luxembourgish: "Stad",
    english: "City",
    pronunciation: "shtat",
    exampleSentence: "Ech ginn an d'Stad.",
  },
  {
    id: "card_city_gare",
    deckId: "deck_in_the_city",
    luxembourgish: "Gare",
    english: "Train station",
    pronunciation: "gar",
    exampleSentence: "D'Gare ass no beim Zentrum.",
  },
  {
    id: "card_city_strooss",
    deckId: "deck_in_the_city",
    luxembourgish: "Strooss",
    english: "Street",
    pronunciation: "shtrohs",
    exampleSentence: "Dës Strooss ass ganz laang.",
  },
  {
    id: "card_city_buttek",
    deckId: "deck_in_the_city",
    luxembourgish: "Buttek",
    english: "Shop",
    pronunciation: "boo-tek",
    exampleSentence: "De Buttek ass nach op.",
  },
  {
    id: "card_food_waasser",
    deckId: "deck_food_drink",
    luxembourgish: "Waasser",
    english: "Water",
    pronunciation: "vah-ser",
    exampleSentence: "Ech hätt gär Waasser.",
  },
  {
    id: "card_food_brout",
    deckId: "deck_food_drink",
    luxembourgish: "Brout",
    english: "Bread",
    pronunciation: "browt",
    exampleSentence: "D'Brout ass frësch.",
  },
  {
    id: "card_food_kaffi",
    deckId: "deck_food_drink",
    luxembourgish: "Kaffi",
    english: "Coffee",
    pronunciation: "kah-fee",
    exampleSentence: "Ech drénken e Kaffi.",
  },
  {
    id: "card_food_zopp",
    deckId: "deck_food_drink",
    luxembourgish: "Zopp",
    english: "Soup",
    pronunciation: "tsop",
    exampleSentence: "D'Zopp ass waarm.",
  },
];

const sections = [
  {
    id: "section_basics",
    slug: "basics",
    title: "Basics",
    description: "Start with the phrases you will use every day.",
    order: 1,
  },
];

const units = [
  {
    id: "unit_greetings",
    sectionId: "section_basics",
    slug: "greetings",
    title: "Greetings",
    description: "Say hello, goodbye, thank you, and ask how someone is.",
    order: 1,
  },
];

const lessonSeed = [
  {
    id: "lesson_greetings_1",
    unitId: "unit_greetings",
    slug: "greetings-1",
    title: "Greetings 1",
    description: "Meet the core greeting words.",
    level: 1,
    order: 1,
    xpReward: 10,
  },
  {
    id: "lesson_greetings_2",
    unitId: "unit_greetings",
    slug: "greetings-2",
    title: "Greetings 2",
    description: "Build short greeting phrases.",
    level: 2,
    order: 2,
    xpReward: 12,
  },
  {
    id: "lesson_greetings_3",
    unitId: "unit_greetings",
    slug: "greetings-3",
    title: "Greetings 3",
    description: "Mix greetings into simple conversations.",
    level: 3,
    order: 3,
    xpReward: 15,
  },
];

const steps = [
  {
    id: "step_greetings_1_01",
    lessonId: "lesson_greetings_1",
    flashcardId: "card_greetings_moien",
    type: "teach" as const,
    order: 1,
    prompt: "Moien",
    content: "Moien means Hello. It is the safest everyday greeting.",
    answer: "Hello",
  },
  {
    id: "step_greetings_1_02",
    lessonId: "lesson_greetings_1",
    flashcardId: "card_greetings_moien",
    type: "multiple_choice" as const,
    order: 2,
    prompt: "What does Moien mean?",
    answer: "Hello",
    choices: ["Hello", "Goodbye", "Thank you", "Water"],
  },
  {
    id: "step_greetings_1_03",
    lessonId: "lesson_greetings_1",
    flashcardId: "card_greetings_addi",
    type: "teach" as const,
    order: 3,
    prompt: "Äddi",
    content: "Äddi means Goodbye.",
    answer: "Goodbye",
  },
  {
    id: "step_greetings_1_04",
    lessonId: "lesson_greetings_1",
    flashcardId: "card_greetings_addi",
    type: "multiple_choice" as const,
    order: 4,
    prompt: "What does Äddi mean?",
    answer: "Goodbye",
    choices: ["Goodbye", "Hello", "Shop", "Coffee"],
  },
  {
    id: "step_greetings_1_05",
    lessonId: "lesson_greetings_1",
    flashcardId: "card_greetings_merci",
    type: "teach" as const,
    order: 5,
    prompt: "Merci",
    content: "Merci means Thank you.",
    answer: "Thank you",
  },
  {
    id: "step_greetings_1_06",
    lessonId: "lesson_greetings_1",
    flashcardId: "card_greetings_merci",
    type: "translate_to_english" as const,
    order: 6,
    prompt: "Merci",
    answer: "Thank you",
  },
  {
    id: "step_greetings_1_07",
    lessonId: "lesson_greetings_1",
    flashcardId: "card_greetings_moien",
    type: "translate_to_lux" as const,
    order: 7,
    prompt: "Hello",
    answer: "Moien",
  },
  {
    id: "step_greetings_1_08",
    lessonId: "lesson_greetings_1",
    flashcardId: "card_greetings_addi",
    type: "translate_to_lux" as const,
    order: 8,
    prompt: "Goodbye",
    answer: "Äddi",
  },
  {
    id: "step_greetings_1_09",
    lessonId: "lesson_greetings_1",
    flashcardId: "card_greetings_merci",
    type: "fill_blank" as const,
    order: 9,
    prompt: "____ means Thank you.",
    answer: "Merci",
    choices: ["Merci", "Moien", "Äddi", "Stad"],
  },
  {
    id: "step_greetings_1_10",
    lessonId: "lesson_greetings_1",
    flashcardId: "card_greetings_moien",
    type: "multiple_choice" as const,
    order: 10,
    prompt: "Pick the Luxembourgish word for Hello.",
    answer: "Moien",
    choices: ["Moien", "Äddi", "Merci", "Gare"],
  },
  {
    id: "step_greetings_2_01",
    lessonId: "lesson_greetings_2",
    flashcardId: "card_greetings_wei_geet_et",
    type: "teach" as const,
    order: 1,
    prompt: "Wéi geet et?",
    content: "Wéi geet et? means How are you?",
    answer: "How are you?",
  },
  {
    id: "step_greetings_2_02",
    lessonId: "lesson_greetings_2",
    flashcardId: "card_greetings_wei_geet_et",
    type: "multiple_choice" as const,
    order: 2,
    prompt: "What does Wéi geet et? mean?",
    answer: "How are you?",
    choices: ["How are you?", "Goodbye", "Thank you", "Where is it?"],
  },
  {
    id: "step_greetings_2_03",
    lessonId: "lesson_greetings_2",
    flashcardId: "card_greetings_moien",
    type: "teach" as const,
    order: 3,
    prompt: "Moien, wéi geet et?",
    content: "This means Hello, how are you?",
    answer: "Hello, how are you?",
  },
  {
    id: "step_greetings_2_04",
    lessonId: "lesson_greetings_2",
    flashcardId: "card_greetings_moien",
    type: "translate_to_english" as const,
    order: 4,
    prompt: "Moien, wéi geet et?",
    answer: "Hello, how are you?",
  },
  {
    id: "step_greetings_2_05",
    lessonId: "lesson_greetings_2",
    flashcardId: "card_greetings_wei_geet_et",
    type: "translate_to_lux" as const,
    order: 5,
    prompt: "How are you?",
    answer: "Wéi geet et?",
  },
  {
    id: "step_greetings_2_06",
    lessonId: "lesson_greetings_2",
    flashcardId: "card_greetings_merci",
    type: "fill_blank" as const,
    order: 6,
    prompt: "____ fir deng Hëllef.",
    answer: "Merci",
    choices: ["Merci", "Äddi", "Moien", "Buttek"],
  },
  {
    id: "step_greetings_2_07",
    lessonId: "lesson_greetings_2",
    flashcardId: "card_greetings_addi",
    type: "multiple_choice" as const,
    order: 7,
    prompt: "Which word ends a conversation?",
    answer: "Äddi",
    choices: ["Äddi", "Moien", "Merci", "Waasser"],
  },
  {
    id: "step_greetings_2_08",
    lessonId: "lesson_greetings_2",
    flashcardId: "card_greetings_moien",
    type: "fill_blank" as const,
    order: 8,
    prompt: "____, wéi geet et?",
    answer: "Moien",
    choices: ["Moien", "Gare", "Zopp", "Strooss"],
  },
  {
    id: "step_greetings_2_09",
    lessonId: "lesson_greetings_2",
    flashcardId: "card_greetings_addi",
    type: "translate_to_english" as const,
    order: 9,
    prompt: "Äddi, bis geschwënn.",
    answer: "Goodbye, see you soon.",
  },
  {
    id: "step_greetings_2_10",
    lessonId: "lesson_greetings_2",
    flashcardId: "card_greetings_wei_geet_et",
    type: "multiple_choice" as const,
    order: 10,
    prompt: "Pick the Luxembourgish phrase for How are you?",
    answer: "Wéi geet et?",
    choices: ["Wéi geet et?", "Ech ginn an d'Stad.", "Ech hätt gär Waasser.", "De Buttek ass op."],
  },
  {
    id: "step_greetings_3_01",
    lessonId: "lesson_greetings_3",
    flashcardId: "card_greetings_moien",
    type: "teach" as const,
    order: 1,
    prompt: "Short greeting pattern",
    content: "Moien + question makes a simple friendly opener.",
    answer: "Moien, wéi geet et?",
  },
  {
    id: "step_greetings_3_02",
    lessonId: "lesson_greetings_3",
    flashcardId: "card_greetings_moien",
    type: "translate_to_lux" as const,
    order: 2,
    prompt: "Hello, how are you?",
    answer: "Moien, wéi geet et?",
  },
  {
    id: "step_greetings_3_03",
    lessonId: "lesson_greetings_3",
    flashcardId: "card_greetings_merci",
    type: "multiple_choice" as const,
    order: 3,
    prompt: "Which phrase thanks someone?",
    answer: "Merci fir deng Hëllef.",
    choices: ["Merci fir deng Hëllef.", "Äddi, bis geschwënn.", "Moien, wéi geet et?", "Ech ginn an d'Stad."],
  },
  {
    id: "step_greetings_3_04",
    lessonId: "lesson_greetings_3",
    flashcardId: "card_greetings_wei_geet_et",
    type: "fill_blank" as const,
    order: 4,
    prompt: "Moien, ____ geet et?",
    answer: "wéi",
    choices: ["wéi", "merci", "äddi", "stad"],
  },
  {
    id: "step_greetings_3_05",
    lessonId: "lesson_greetings_3",
    flashcardId: "card_greetings_addi",
    type: "translate_to_lux" as const,
    order: 5,
    prompt: "Goodbye, see you soon.",
    answer: "Äddi, bis geschwënn.",
  },
  {
    id: "step_greetings_3_06",
    lessonId: "lesson_greetings_3",
    flashcardId: "card_greetings_moien",
    type: "multiple_choice" as const,
    order: 6,
    prompt: "What is the best first word in a greeting?",
    answer: "Moien",
    choices: ["Moien", "Zopp", "Strooss", "Waasser"],
  },
  {
    id: "step_greetings_3_07",
    lessonId: "lesson_greetings_3",
    flashcardId: "card_greetings_merci",
    type: "translate_to_english" as const,
    order: 7,
    prompt: "Merci fir deng Hëllef.",
    answer: "Thank you for your help.",
  },
  {
    id: "step_greetings_3_08",
    lessonId: "lesson_greetings_3",
    flashcardId: "card_greetings_addi",
    type: "fill_blank" as const,
    order: 8,
    prompt: "____, bis geschwënn.",
    answer: "Äddi",
    choices: ["Äddi", "Merci", "Moien", "Gare"],
  },
  {
    id: "step_greetings_3_09",
    lessonId: "lesson_greetings_3",
    flashcardId: "card_greetings_wei_geet_et",
    type: "multiple_choice" as const,
    order: 9,
    prompt: "Choose the full opener.",
    answer: "Moien, wéi geet et?",
    choices: ["Moien, wéi geet et?", "Äddi, bis geschwënn.", "D'Brout ass frësch.", "De Buttek ass op."],
  },
  {
    id: "step_greetings_3_10",
    lessonId: "lesson_greetings_3",
    flashcardId: "card_greetings_wei_geet_et",
    type: "translate_to_english" as const,
    order: 10,
    prompt: "Moien, wéi geet et haut?",
    answer: "Hello, how are you today?",
  },
];

async function main() {
  await db
    .insert(flashcardDecks)
    .values(
      decks.map((deck) => ({
        ...deck,
        type: "preset" as const,
        updatedAt: now,
      }))
    )
    .onConflictDoUpdate({
      target: flashcardDecks.id,
      set: {
        slug: sql`excluded.slug`,
        title: sql`excluded.title`,
        description: sql`excluded.description`,
        updatedAt: now,
      },
    });

  await db.delete(flashcards).where(
    inArray(
      flashcards.id,
      cards.map((card) => card.id)
    )
  );

  await db.insert(flashcards).values(
    cards.map((card) => ({
      ...card,
      updatedAt: now,
    }))
  );

  await db
    .insert(courseSections)
    .values(
      sections.map((section) => ({
        ...section,
        updatedAt: now,
      }))
    )
    .onConflictDoUpdate({
      target: courseSections.id,
      set: {
        slug: sql`excluded.slug`,
        title: sql`excluded.title`,
        description: sql`excluded.description`,
        order: sql`excluded."order"`,
        updatedAt: now,
      },
    });

  await db
    .insert(courseUnits)
    .values(
      units.map((unit) => ({
        ...unit,
        updatedAt: now,
      }))
    )
    .onConflictDoUpdate({
      target: courseUnits.id,
      set: {
        sectionId: sql`excluded.section_id`,
        slug: sql`excluded.slug`,
        title: sql`excluded.title`,
        description: sql`excluded.description`,
        order: sql`excluded."order"`,
        updatedAt: now,
      },
    });

  await db
    .insert(lessons)
    .values(
      lessonSeed.map((lesson) => ({
        ...lesson,
        updatedAt: now,
      }))
    )
    .onConflictDoUpdate({
      target: lessons.id,
      set: {
        unitId: sql`excluded.unit_id`,
        slug: sql`excluded.slug`,
        title: sql`excluded.title`,
        description: sql`excluded.description`,
        level: sql`excluded.level`,
        order: sql`excluded."order"`,
        xpReward: sql`excluded.xp_reward`,
        updatedAt: now,
      },
    });

  await db.delete(lessonSteps).where(
    inArray(
      lessonSteps.id,
      steps.map((step) => step.id)
    )
  );

  await db.insert(lessonSteps).values(
    steps.map((step) => ({
      ...step,
      updatedAt: now,
    }))
  );
}

main()
  .then(() => {
    console.log("Seeded flashcard decks and lesson path.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
