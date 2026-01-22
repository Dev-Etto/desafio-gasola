import { Socket } from 'socket.io'

export const safeExec = async (socket: Socket, action: () => Promise<void>) => {
  try {
    await action()
  } catch (error: any) {
    console.error('Socket Error:', error.message)

    const message = error.message || 'An unexpected error occurred'
    const code = error.code || 'E_UNKNOWN'

    socket.emit('error', {
      message,
      code,
    })
  }
}
