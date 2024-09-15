import styled from 'styled-components';

export const TaskCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
`;

export const HighPriorityTask = styled.div`
    background-color: #ffd54f;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const TaskItem = styled.div`
    background-color: #ffffff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const DeleteButton = styled.button`
    background: #e57373;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    font-size: 16px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s, transform 0.2s;

    &:hover {
        background-color: #f44336;
        transform: scale(1.05);
    }

    &:active {
        background-color: #c62828;
        transform: scale(0.98);
    }

    svg {
        vertical-align: middle;
        margin-right: 4px;
    }
`;

export const EditLink = styled.a`
    display: inline-flex;
    align-items: center;
    background-color: #64b5f6;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    transition: background-color 0.3s, transform 0.2s;

    &:hover {
        background-color: #42a5f5;
        transform: scale(1.05);
    }

    &:active {
        background-color: #1e88e5;
        transform: scale(0.98);
    }

    svg {
        margin-right: 6px;
    }
`;
