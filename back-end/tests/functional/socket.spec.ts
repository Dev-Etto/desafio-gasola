import { test } from '@japa/runner'
import GameService from '#services/game_service'
import Game from '#models/game'
import Word from '#models/word'
import User from '#models/user'
import Category from '#models/category'
import { GameStatus } from '#enums/game_status'

test.group('GameService (Logic used by Socket)', () => {
  test('processGuess: handles correct guess and updates response', async ({ assert }) => {
    const category = await Category.firstOrCreate({ name: 'ServiceTest' }, { name: 'ServiceTest' })
    const word = await Word.create({ word: 'SERVICE', categoryId: category.id })
    const user = await User.create({ username: 'svc_player_' + Date.now() })

    const game = await Game.create({
      userId: user.id,
      wordId: word.id,
      status: GameStatus.PLAYING,
      remainingLives: 6,
      lettersGuessed: JSON.stringify([]),
      score: 0,
    })

    const service = new GameService()
    const result = await service.processGuess(game.id, 'S')

    assert.deepEqual(result.guessed, ['S'])
    assert.equal(result.wordMask, 'S _ _ _ _ _ _')
    assert.equal(result.game.remainingLives, 6)
  })

  test('processGuess: handles incorrect guess', async ({ assert }) => {
    const category = await Category.firstOrCreate(
      { name: 'ServiceTest2' },
      { name: 'ServiceTest2' }
    )
    const word = await Word.create({ word: 'TEST', categoryId: category.id })
    const user = await User.create({ username: 'svc_player2_' + Date.now() })

    const game = await Game.create({
      userId: user.id,
      wordId: word.id,
      status: GameStatus.PLAYING,
      remainingLives: 6,
      lettersGuessed: JSON.stringify([]),
      score: 0,
    })

    const service = new GameService()
    const result = await service.processGuess(game.id, 'Z')

    assert.deepEqual(result.guessed, ['Z'])
    assert.equal(result.wordMask, '_ _ _ _')
    assert.equal(result.game.remainingLives, 5)
  })
})
