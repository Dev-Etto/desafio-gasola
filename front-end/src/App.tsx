import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: var(--primary-color);
`;

function App() {
  return (
    <Container>
      <Title>Jogo da Forca</Title>
      <p>Em breve...</p>
    </Container>
  )
}

export default App
