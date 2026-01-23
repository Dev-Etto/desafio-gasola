interface HangmanFigureProps {
  lives: number
}

export function HangmanFigure({ lives }: HangmanFigureProps) {
  const errors = 6 - lives

  return (
    <svg width="200" height="250" viewBox="0 0 200 250">
      <line x1="20" y1="240" x2="180" y2="240" stroke="white" strokeWidth="4" />
      <line x1="50" y1="240" x2="50" y2="20" stroke="white" strokeWidth="4" />
      <line x1="50" y1="20" x2="150" y2="20" stroke="white" strokeWidth="4" />
      <line x1="150" y1="20" x2="150" y2="50" stroke="white" strokeWidth="4" />

      {errors >= 1 && (
        <circle cx="150" cy="80" r="30" stroke="white" strokeWidth="4" fill="transparent" />
      )}
      {errors >= 2 && (
        <line x1="150" y1="110" x2="150" y2="170" stroke="white" strokeWidth="4" />
      )}
      {errors >= 3 && (
        <line x1="150" y1="130" x2="120" y2="160" stroke="white" strokeWidth="4" />
      )}
      {errors >= 4 && (
        <line x1="150" y1="130" x2="180" y2="160" stroke="white" strokeWidth="4" />
      )}
      {errors >= 5 && (
        <line x1="150" y1="170" x2="120" y2="210" stroke="white" strokeWidth="4" />
      )}
      {errors >= 6 && (
        <line x1="150" y1="170" x2="180" y2="210" stroke="white" strokeWidth="4" />
      )}
    </svg>
  )
}
