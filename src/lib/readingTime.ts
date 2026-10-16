const WORDS_PER_MINUTE = 230

/** "4 min read", or undefined when the provider doesn't report a word count. */
export const readingTime = (wordCount: number | undefined) =>
  wordCount ? `${Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))} min read` : undefined
