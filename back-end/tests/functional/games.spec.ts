import { test } from '@japa/runner'
import Game from '#models/game'
import Word from '#models/word'
import User from '#models/user'
import Category from '#models/category'
import { GameStatus } from '#enums/game_status'

test.group('Games', () => {
  test('successfully create a new game', async ({ client, assert }) => {
    const mainCategory = await Category.firstOrCreate({ name: 'General' }, { name: 'General' })
    await Word.create({ word: 'SAMPLE', categoryId: mainCategory.id })

    const response = await client.post('/games').json({
      username: 'player1',
    })

    response.assertStatus(201)
    response.assertBodyContains({
      username: 'player1',
      remainingLives: 6,
      lettersGuessed: [],
      status: GameStatus.PLAYING,
    })

    const body = response.body()
    assert.exists(body.gameId)
    assert.exists(body.wordLength)
    assert.isNumber(body.wordLength)
    assert.exists(body.category)
  })

  test('cannot create game without username', async ({ client }) => {
    const response = await client.post('/games').json({})
    response.assertStatus(422)
  })

  test('game logic: correct guess', async ({ client }) => {
    const category = await Category.create({ name: 'TestCat_' + Date.now() })
    const word = await Word.create({ word: 'TEST', categoryId: category.id })
    const user = await User.create({ username: 'tester_' + Date.now() })

    const game = await Game.create({
      userId: user.id,
      wordId: word.id,
      status: GameStatus.PLAYING,
      remainingLives: 6,
      lettersGuessed: JSON.stringify([]),
      score: 0,
    })

    const response = await client.post(`/games/${game.id}/guess`).json({
      letter: 't',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      status: GameStatus.PLAYING,
      remainingLives: 6,
      lettersGuessed: ['T'],
      wordMask: 'T _ _ T',
    })
  })

  test('game logic: incorrect guess decreases life', async ({ client }) => {
    const category = await Category.create({ name: 'TestCat2_' + Date.now() })
    const word = await Word.create({ word: 'APPLE', categoryId: category.id })
    const user = await User.create({ username: 'tester2_' + Date.now() })

    const game = await Game.create({
      userId: user.id,
      wordId: word.id,
      status: GameStatus.PLAYING,
      remainingLives: 6,
      lettersGuessed: JSON.stringify([]),
      score: 0,
    })

    const response = await client.post(`/games/${game.id}/guess`).json({
      letter: 'Z',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      status: GameStatus.PLAYING,
      remainingLives: 5,
      lettersGuessed: ['Z'],
      wordMask: '_ _ _ _ _',
    })
  })

  test('game logic: winning the game', async ({ client, assert }) => {
    const category = await Category.create({ name: 'TestCat3_' + Date.now() })
    const word = await Word.create({ word: 'HI', categoryId: category.id })
    const user = await User.create({ username: 'winner_' + Date.now() })

    const game = await Game.create({
      userId: user.id,
      wordId: word.id,
      status: GameStatus.PLAYING,
      remainingLives: 6,
      lettersGuessed: JSON.stringify(['H']),
      score: 0,
    })

    const response = await client.post(`/games/${game.id}/guess`).json({
      letter: 'I',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      status: GameStatus.WON,
      message: 'You Won!',
    })

    const refreshedGame = await Game.find(game.id)
    assert.equal(refreshedGame?.status, GameStatus.WON)
  })

  test('game logic: losing the game', async ({ client }) => {
    const category = await Category.create({ name: 'TestCat4_' + Date.now() })
    const word = await Word.create({ word: 'A', categoryId: category.id })
    const user = await User.create({ username: 'loser_' + Date.now() })

    const game = await Game.create({
      userId: user.id,
      wordId: word.id,
      status: GameStatus.PLAYING,
      remainingLives: 1,
      lettersGuessed: JSON.stringify([]),
      score: 0,
    })

    const response = await client.post(`/games/${game.id}/guess`).json({
      letter: 'Z',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      status: GameStatus.LOST,
      message: 'Game Over',
      remainingLives: 0,
    })
  })
})
