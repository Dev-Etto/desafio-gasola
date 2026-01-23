import styled from 'styled-components'

export interface RankingItem {
  username: string
  highScore: number
}

interface RankingTableProps {
  rankings: RankingItem[]
  highlightUsername?: string
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.surface};
`

const Th = styled.th`
  padding: 0.75rem;
  text-align: left;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: bold;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
`

const Tbody = styled.tbody``

const Tr = styled.tr<{ $highlight?: boolean }>`
  background: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.primary + '20' : 'transparent'};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`

const Td = styled.td`
  padding: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
`

const Position = styled(Td)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  width: 60px;
  text-align: center;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
`

const strings = {
  emptyState: 'Nenhum ranking disponível ainda.',
  position: '#',
  player: 'Jogador',
  score: 'Pontuação',
}

export function RankingTable({ rankings, highlightUsername }: RankingTableProps) {
  if (rankings.length === 0) {
    return <EmptyState>{strings.emptyState}</EmptyState>
  }

  return (
    <Table>
      <Thead>
        <tr>
          <Th style={{ width: '60px', textAlign: 'center' }}>{strings.position}</Th>
          <Th>{strings.player}</Th>
          <Th style={{ textAlign: 'right' }}>{strings.score}</Th>
        </tr>
      </Thead>
      <Tbody>
        {rankings.map((item, index) => (
          <Tr key={index} $highlight={item.username === highlightUsername}>
            <Position>{index + 1}</Position>
            <Td>{item.username}</Td>
            <Td style={{ textAlign: 'right', fontWeight: 'bold' }}>
              {item.highScore}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
