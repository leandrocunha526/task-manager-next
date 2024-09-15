import React from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #FFFFFF;
  padding: 40px 20px 20px 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #333;
  padding: 10px;
  border-radius: 50%;
  transition: background-color 0.3s ease, color 0.3s ease; /* Add uma transição suave */

  &:hover {
    color: #fff;
    background-color: #ff0000; /* Destacando o botão com fundo vermelho no hover */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Adicionando uma sombra para destaque */
  }
`;

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {/* Botão "X" para fechar o modal */}
        <CloseButton onClick={onClose}>×</CloseButton>
        {children}
      </ModalContent>
    </ModalBackground>
  );
};

export default Modal;
