import styled from 'styled-components'
import type { ReactNode } from 'react'

interface ModalProps {
  children: ReactNode
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const Content = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`

export function Modal({ children }: ModalProps) {
  return (
    <Overlay>
      <Content>{children}</Content>
    </Overlay>
  )
}
