import React from 'react';
import { StyledButton } from './styles';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  color?: string;
  hoverColor?: string;
}

const Button = ({ children, onClick, type = 'button', color, hoverColor }: ButtonProps) => {
  return (
    <StyledButton onClick={onClick} type={type} $color={color} $hoverColor={hoverColor}>
      {children}
    </StyledButton>
  );
};

export default Button;
