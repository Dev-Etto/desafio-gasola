import { test } from '@japa/runner'
import Game from '#models/game'
import Word from '#models/word'
import User from '#models/user'
import Category from '#models/category'
import { GameStatus } from '#enums/game_status'

const SESSION_ID = '550e8400-e29b-41d4-a716-446655440011'

test.group('Game Score & Ranking', () => {
  test('accumulates session score and updates high score on win', async ({ client, assert }) => {
    const category = await Category.firstOrCreate({ name: 'ScoreTest' }, { name: 'ScoreTest' })
    const word = await Word.create({ word: 'AB', categoryId: category.id })
    const username = `score_player_${Date.now()}`

    const createAndForceWord = async (wordId: number) => {
      const gameResponse = await client.post('/games').json({ username, sessionId: SESSION_ID })
      gameResponse.assertStatus(201)
      const gameId = gameResponse.body().gameId

      const game = await Game.find(gameId)
      assert.exists(game, 'Game should exist after creation')
      game!.wordId = wordId
      await game!.save()

      return gameId
    }

    const game1Id = await createAndForceWord(word.id)
    await client.post(`/games/${game1Id}/guess`).json({ letter: 'A' })
    const firstWinResponse = await client.post(`/games/${game1Id}/guess`).json({ letter: 'B' })

    firstWinResponse.assertBodyContains({
      status: GameStatus.WON,
      sessionScore: 50,
    })

    const user = await User.findBy('username', username)
    assert.equal(user?.highScore, 50, 'High score should be 50 after first win')

    const game2Id = await createAndForceWord(word.id)
    await client.post(`/games/${game2Id}/guess`).json({ letter: 'A' })
    const secondWinResponse = await client.post(`/games/${game2Id}/guess`).json({ letter: 'B' })

    secondWinResponse.assertBodyContains({
      status: GameStatus.WON,
      sessionScore: 100,
    })

    await user?.refresh()
    assert.equal(user?.highScore, 100, 'High score should be 100 after second win')
  })
})
