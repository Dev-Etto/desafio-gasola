import { Server } from 'socket.io'
import type { Server as HttpServer } from 'node:http'
import env from '#start/env'

class WsService {
  io: Server | undefined
  private isBooted = false

  async boot(httpServer: HttpServer) {
    if (this.isBooted) {
      return
    }

    this.isBooted = true
    const corsOrigin = env.get('CORS_ORIGIN')
    this.io = new Server(httpServer, {
      cors: {
        origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
        credentials: true,
      },
    })

    await import('#start/socket')
  }

  ready(callback: (io: Server) => void) {
    if (this.io) {
      callback(this.io)
    } else {
      const check = setInterval(() => {
        if (this.io) {
          clearInterval(check)
          callback(this.io)
        }
      }, 10)
    }
  }
}

export default new WsService()
