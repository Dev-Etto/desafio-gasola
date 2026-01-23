import styled from 'styled-components'

interface CategoryDisplayProps {
  category?: string
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid ${({ theme }) => theme.colors.primary};
`

const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 1px;
`

const Category = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
`

export function CategoryDisplay({ category }: CategoryDisplayProps) {
  if (!category) return null

  return (
    <Container>
      <Label>Categoria</Label>
      <Category>{category}</Category>
    </Container>
  )
}
