import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: #3b82f6;
    --background-color: #f8fafc;
    --text-color: #1e293b;
    --error-color: #ef4444;
    --success-color: #22c55e;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    cursor: pointer;
    border: none;
    font-family: inherit;
  }

  ul, ol {
    list-style: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
