export function normalizeLessonAnswer(value: string) {
  return value
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/[.!?,]/g, "")
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ");
}

export function removeLessonAccents(value: string) {
  return normalizeLessonAnswer(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC");
}

export function getLessonAnswerResult(answer: string, expected: string) {
  if (normalizeLessonAnswer(answer) === normalizeLessonAnswer(expected)) {
    return "correct";
  }

  if (removeLessonAccents(answer) === removeLessonAccents(expected)) {
    return "accent-warning";
  }

  return "wrong";
}

export function isLessonAnswerCorrect(answer: string, expected: string) {
  return getLessonAnswerResult(answer, expected) !== "wrong";
}
