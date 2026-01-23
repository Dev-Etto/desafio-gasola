import { test } from '@japa/runner'
import Game from '#models/game'
import Word from '#models/word'
import User from '#models/user'
import Category from '#models/category'
import { GameStatus } from '#enums/game_status'

test.group('Game Score & Ranking', () => {
  test('accumulates session score and updates high score on win', async ({ client, assert }) => {
    const sessionId = '550e8400-e29b-41d4-a716-446655440011'
    const category = await Category.firstOrCreate({ name: 'ScoreTest' }, { name: 'ScoreTest' })
    const word = await Word.create({ word: 'AB', categoryId: category.id })
    const username = 'score_player_' + Date.now()
    
    const game1Response = await client.post('/games').json({
      username,
      sessionId,
    })
    game1Response.assertStatus(201)
    const game1Id = game1Response.body().gameId
    
    const game1 = await Game.find(game1Id)
    if (game1) {
        game1.wordId = word.id
        await game1.save()
    }

    await client.post(`/games/${game1Id}/guess`).json({ letter: 'A' })
    const win1Response = await client.post(`/games/${game1Id}/guess`).json({ letter: 'B' })

    win1Response.assertBodyContains({
        status: GameStatus.WON,
        sessionScore: 50
    })

    const user = await User.findBy('username', username)
    assert.equal(user?.highScore, 50, 'High score should be 50 after first win')

    const game2Response = await client.post('/games').json({
        username,
        sessionId,
      })
    const game2Id = game2Response.body().gameId

    const game2 = await Game.find(game2Id)
    if (game2) {
        game2.wordId = word.id
        await game2.save()
    }

    await client.post(`/games/${game2Id}/guess`).json({ letter: 'A' })
    const win2Response = await client.post(`/games/${game2Id}/guess`).json({ letter: 'B' })

    win2Response.assertBodyContains({
        status: GameStatus.WON,
        sessionScore: 100
    })

    await user?.refresh()
    assert.equal(user?.highScore, 100, 'High score should be 100 after second win')
  })
})
