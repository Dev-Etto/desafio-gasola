import { test } from '@japa/runner'
import User from '#models/user'
import Game from '#models/game'
import Word from '#models/word'
import Category from '#models/category'
import { GameStatus } from '#enums/game_status'

test.group('Arcade Mode', (group) => {
  group.each.setup(async () => {
    await Game.query().delete()
    await User.query().delete()
    await Word.query().delete()
    await Category.query().delete()

    const category = await Category.create({ name: 'Test Category' })
    await Word.create({ word: 'TEST', hint: 'Test Hint', categoryId: category.id })
    await Word.create({ word: 'HELLO', hint: 'Hello Hint', categoryId: category.id })
  })

  test('calculates score correctly and updates high score on game over', async ({
    client,
    assert,
  }) => {
    const sessionId = '550e8400-e29b-41d4-a716-446655440000'
    const username = 'player1'

    const createResponse = await client.post('/games').json({ username, sessionId })
    createResponse.assertStatus(201)
    const game1Id = createResponse.body().gameId

    const game1 = await Game.find(game1Id)
    await game1?.load('word')
    const word1 = game1?.word.word.toUpperCase() || ''

    const uniqueLetters1 = [...new Set(word1.split(''))]
    for (const letter of uniqueLetters1) {
      await client.post(`/games/${game1Id}/guess`).json({ letter })
    }

    const game1Updated = await Game.find(game1Id)
    assert.equal(game1Updated?.status, GameStatus.WON)
    const expectedScore1 = uniqueLetters1.length * 10 + 6 * 5
    assert.equal(game1Updated?.score, expectedScore1)

    const user = await User.findBy('username', username)
    assert.equal(user?.highScore, 0)

    const createResponse2 = await client.post('/games').json({ username, sessionId })
    const game2Id = createResponse2.body().gameId

    const game2 = await Game.find(game2Id)
    await game2?.load('word')
    const word2 = game2?.word.word.toUpperCase() || ''

    let wrongCount = 0
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (const char of alphabet) {
      if (!word2.includes(char)) {
        await client.post(`/games/${game2Id}/guess`).json({ letter: char })
        wrongCount++
        if (wrongCount >= 6) break
      }
    }

    const game2Updated = await Game.find(game2Id)
    assert.equal(game2Updated?.status, GameStatus.LOST)
    assert.equal(game2Updated?.score, 0)

    await user?.refresh()
    assert.equal(user?.highScore, expectedScore1)
  })

  test('ranking returns top users ordered by high score', async ({ client, assert }) => {
    await User.create({ username: 'Alice', highScore: 100 })
    await User.create({ username: 'Bob', highScore: 200 })
    await User.create({ username: 'Charlie', highScore: 50 })

    const response = await client.get('/ranking')
    response.assertStatus(200)
    const ranking = response.body()

    assert.lengthOf(ranking, 3)
    assert.equal(ranking[0].username, 'Bob')
    assert.equal(ranking[1].username, 'Alice')
    assert.equal(ranking[2].username, 'Charlie')
  })
})
