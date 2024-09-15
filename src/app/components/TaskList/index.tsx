import React, { useEffect, useState } from 'react';
import Tasks from '@/app/interfaces/tasks';
import { TaskItem, HighPriorityTask, TaskCardContainer, DeleteButton, EditLink } from './styles';
import { api } from '@/app/services/api';
import Link from 'next/link';

interface TaskListProps {
    listId: number;
    tasks: Tasks[];
}

const TaskList = ({ tasks: initialTasks }: TaskListProps) => {
    const [tasks, setTasks] = useState<Tasks[]>(initialTasks);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const tasksResponse = await api.get('/api/items');
                setTasks(tasksResponse.data);
            } catch (error) {
                setError('Erro ao carregar dados: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const handleDelete = async (taskId: number) => {
        try {
            setLoading(true);
            await api.delete(`/api/items/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            setError('Erro ao excluir a tarefa: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Carregando tarefas...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <TaskCardContainer>
            {tasks.length === 0 ? (
                <p>Nenhuma tarefa encontrada para esta lista.</p>
            ) : (
                tasks.map((task) => (
                    task.priority ? (
                        <HighPriorityTask key={task.id}>
                            <DeleteButton onClick={() => handleDelete(task.id)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-trash-2"
                                >
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"></path>
                                    <path d="M10 11v6"></path>
                                    <path d="M14 11v6"></path>
                                    <path d="M18 6l-1-3H7L6 6"></path>
                                </svg>
                            </DeleteButton>
                            <h1>{task.title}</h1>
                            <strong>Prioridade: {task.priority ? 'SIM' : 'NÃO'}</strong>
                            <p>Descrição: {task.description}</p>
                            <p>Status: {task.state}</p>
                            <p>Criado em: {new Date(task.createdAt).toLocaleString()}</p>
                            <p>Atualizado em: {new Date(task.updatedAt).toLocaleString()}</p>
                            <Link href={`/tasks/update/${task.id}`}>
                                <EditLink>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-edit"
                                    >
                                        <path d="M11 4L16 9"></path>
                                        <path d="M2 20L11 4l5 5L7 19 2 20z"></path>
                                    </svg>
                                    Editar
                                </EditLink>
                            </Link>
                        </HighPriorityTask>
                    ) : (
                        <TaskItem key={task.id}>
                            <DeleteButton onClick={() => handleDelete(task.id)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-trash-2"
                                >
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"></path>
                                    <path d="M10 11v6"></path>
                                    <path d="M14 11v6"></path>
                                    <path d="M18 6l-1-3H7L6 6"></path>
                                </svg>
                            </DeleteButton>
                            <h1>{task.title}</h1>
                            <strong>Prioridade: {task.priority ? 'SIM' : 'NÃO'}</strong>
                            <p>Descrição: {task.description}</p>
                            <p>Status: {task.state}</p>
                            <p>Criado em: {new Date(task.createdAt).toLocaleString()}</p>
                            <p>Atualizado em: {new Date(task.updatedAt).toLocaleString()}</p>
                            <Link href={`/tasks/update/${task.id}`}>
                                <EditLink>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-edit"
                                    >
                                        <path d="M11 4L16 9"></path>
                                        <path d="M2 20L11 4l5 5L7 19 2 20z"></path>
                                    </svg>
                                    Editar
                                </EditLink>
                            </Link>
                        </TaskItem>
                    )
                ))
            )}
        </TaskCardContainer>
    );
};

export default TaskList;
