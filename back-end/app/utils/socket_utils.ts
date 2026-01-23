import { Socket } from 'socket.io'
import { SOCKET_EVENTS } from '../constants/socket_events.js'

export const safeExec = async (socket: Socket, action: () => Promise<void>) => {
  try {
    await action()
  } catch (error: any) {
    console.error('Socket Error:', error.message)

    const message = error.message || 'An unexpected error occurred'
    const code = error.code || 'E_UNKNOWN'

    socket.emit(SOCKET_EVENTS.ERROR, {
      message,
      code,
    })
  }
}
