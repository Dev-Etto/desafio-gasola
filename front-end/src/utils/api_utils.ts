export interface ApiResult<T> {
  data: T | null
  error: string | null
  success: boolean
}

export const safeApiCall = async <T>(
  action: () => Promise<T>,
  errorMessage = 'Ocorreu um erro inesperado.'
): Promise<ApiResult<T>> => {
  try {
    const data = await action()
    return {
      data,
      error: null,
      success: true,
    }
  } catch (error) {
    console.error('API Error:', error)
    
    const message = error instanceof Error ? error.message : errorMessage
    
    return {
      data: null,
      error: message,
      success: false,
    }
  }
}

export const safeApiCallWithState = async <T>(
  action: () => Promise<T>,
  setLoading: (loading: boolean) => void,
  setError: (error: string) => void,
  errorMessage = 'Ocorreu um erro inesperado.'
): Promise<T | null> => {
  setLoading(true)
  setError('')

  try {
    const data = await action()
    return data
  } catch (error) {
    console.error('API Error:', error)
    const message = error instanceof Error ? error.message : errorMessage
    setError(message)
    return null
  } finally {
    setLoading(false)
  }
}
