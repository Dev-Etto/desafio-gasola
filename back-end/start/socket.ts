import Ws from '#services/ws'
import { Server, Socket } from 'socket.io'
import { safeExec } from '../app/utils/socket_utils.js'
import { GAME_MESSAGES } from '../app/constants/messages.js'

Ws.ready((io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('New connection: ', socket.id)

    socket.on('join_game', (data: any) => {
      safeExec(socket, async () => {
        const { game_id: gameId } = data
        if (gameId) {
          socket.join(`game:${gameId}`)
          console.log(`Socket ${socket.id} joined game:${gameId}`)
        }
      })
    })

    socket.on('guess', (data: any) => {
      safeExec(socket, async () => {
        const { game_id: gameId, letter } = data

        const GameService = await import('#services/game_service')
        const service = new GameService.default()
        const result = await service.processGuess(gameId, letter)

        const response = {
          game_id: result.game.id,
          status: result.game.status,
          remaining_lives: result.game.remainingLives,
          letters_guessed: result.guessed,
          word_mask: result.wordMask,
          message: result.isWin
            ? GAME_MESSAGES.YOU_WON
            : result.isLoss
              ? GAME_MESSAGES.GAME_OVER
              : GAME_MESSAGES.KEEP_GUESSING,
          score: result.game.score,
          word_reveal: result.isWin || result.isLoss ? result.targetWord : undefined,
        }

        io.to(`game:${gameId}`).emit('game_update', response)
      })
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id)
    })
  })
})
