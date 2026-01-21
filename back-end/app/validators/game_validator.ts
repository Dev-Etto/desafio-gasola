import vine from '@vinejs/vine'

export const createGameValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(1).maxLength(50),
  })
)

export const guessLetterValidator = vine.compile(
  vine.object({
    letter: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(1)
      .regex(/^[a-zA-Z]$/)
      .toUpperCase(),
  })
)
