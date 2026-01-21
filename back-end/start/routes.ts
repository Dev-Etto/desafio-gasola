/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const GamesController = () => import('#controllers/games_controller')
const RankingsController = () => import('#controllers/rankings_controller')

router.get('/', async () => {
  return {
    on: 'Server is running!',
  }
})

router.post('/games', [GamesController, 'store'])
router.post('/games/:id/guess', [GamesController, 'guess'])
router.get('/ranking', [RankingsController, 'index'])
