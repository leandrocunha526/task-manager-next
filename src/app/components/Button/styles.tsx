import styled from 'styled-components';

interface StyledButtonProps {
  $color?: string;
  $hoverColor?: string;
}

export const StyledButton = styled.button<StyledButtonProps>`
  padding: 10px 15px;
  background-color: ${(props) => props.$color || '#0070f3'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.$hoverColor || '#005bb5'};
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;
