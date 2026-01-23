import styled from 'styled-components'

interface WordDisplayProps {
  wordMask: string
}

const Container = styled.div`
  display: flex;
  gap: 1rem;
  font-family: ${({ theme }) => theme.fonts.code};
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: bold;
  letter-spacing: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 2rem 0;
`

export function WordDisplay({ wordMask }: WordDisplayProps) {
  return <Container>{wordMask}</Container>
}
