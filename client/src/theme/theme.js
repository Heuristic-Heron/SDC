import { createGlobalStyle } from "styled-components";
import './theme.styles.css';

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: 50%;
  }

  * {
    font-family: 'Nunito', sans-serif;
  }

  a {
    transition: 0.3s;
    color: inherit;
    text-decoration: none;
    opacity: 0.5;
  }

  a&:hover {
    opacity: 1;
  }
`;

export const lightTheme = {
  body: "#f0f0f0",
  text: "#121212"
};

export const darkTheme = {
  body: "#282c39",
  text: "#f1f1f1"
};
