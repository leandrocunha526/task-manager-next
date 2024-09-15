import { styled } from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Input = styled.input`
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
`;

export const Textarea = styled.textarea`
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  resize: none;
  height: 80px;
`;

export const Select = styled.select`
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9em;
`;
