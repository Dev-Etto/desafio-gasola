import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Word from '#models/word'
import { GameStatus } from '#enums/game_status'

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ serializeAs: 'user_id' })
  declare userId: number

  @column({ serializeAs: 'word_id' })
  declare wordId: number

  @column()
  declare status: GameStatus

  @column({ serializeAs: 'letters_guessed' })
  declare lettersGuessed: string

  @column({ serializeAs: 'remaining_lives' })
  declare remainingLives: number

  @column()
  declare score: number

  @column({ serializeAs: 'hint_used' })
  declare hintUsed: boolean

  @column({ serializeAs: 'session_id' })
  declare sessionId: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Word)
  declare word: BelongsTo<typeof Word>

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare updatedAt: DateTime
}
