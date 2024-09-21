import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/app/services/api';
import Lists from '@/app/interfaces/lists';
import Task from '@/app/interfaces/tasks';
import { styled } from 'styled-components';

export const sharedInputStyles = `
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    border-color: #0070f3;
    outline: none;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormField = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  ${sharedInputStyles}
`;

const TextArea = styled.textarea`
  ${sharedInputStyles}
  min-height: 100px;
`;

const Select = styled.select`
  ${sharedInputStyles}
`;

const Checkbox = styled.input`
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  color: white;
  background-color: #0070f3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #005bb5;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin: 10px 0;
  font-size: 14px;
`;


const TaskEditForm = () => {
    const router = useRouter();
    const { id } = router.query;

    const [task, setTask] = useState<Task>({
        id: 0,
        title: '',
        description: '',
        priority: false,
        state: '',
        listId: 0,
        createdAt: '',
        updatedAt: ''
    });
    const [lists, setLists] = useState<Lists[]>([]);
    const [error, setError] = useState<string>('');
    const [validation, setValidation] = useState<string>('');

    useEffect(() => {
        if (id && typeof id === 'string') {
            const fetchTask = async () => {
                try {
                    const response = await api.get(`/api/items/${id}`);
                    setTask(response.data);
                } catch (error) {
                    setError('Erro ao carregar a tarefa.');
                    if (error.response?.status === 404) {
                        router.push('/');
                    }
                }
            };
            fetchTask();
        }
    }, [id, router]);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await api.get('/api/lists');
                setLists(response.data);
            } catch (error) {
                setError('Erro ao carregar listas.');
            }
        };
        fetchLists();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (task.title.length < 5) {
            setValidation("Titulo é menor que 5 caracteres")
        }

        if (task.description.length < 5) {
            setValidation("Descrição é menor que 5 caracteres")
        }
        try {
            await api.put(`/api/items/${id}`, mapTaskToApiFormat(task));
            router.push('/'); // Redireciona após salvar
        } catch (error) {
            setError('Erro ao salvar a tarefa.');
        }
    };

    const handleGoBack = () => {
        router.back(); // Volta para a página anterior
    };

    // Função para mapear os dados do formulário para o formato esperado pela API
    const mapTaskToApiFormat = (task: Task) => ({
        title: task.title,
        description: task.description,
        priority: task.priority,
        state: task.state,
        listId: task.listId,
    });

    return (
        <FormContainer onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {validation && <ErrorMessage>{validation}</ErrorMessage>}
            <FormField>
                <Label htmlFor="title">Título</Label>
                <Input
                    type="text"
                    id="title"
                    name="title"
                    value={task.title}
                    onChange={(e) => setTask(prevTask => ({
                        ...prevTask,
                        title: e.target.value
                    }))}
                    required
                />
            </FormField>
            <FormField>
                <Label htmlFor="description">Descrição</Label>
                <TextArea
                    id="description"
                    name="description"
                    value={task.description}
                    onChange={(e) => setTask(prevTask => ({
                        ...prevTask,
                        description: e.target.value
                    }))}
                    required
                />
            </FormField>
            <FormField>
                <Label htmlFor="priority">Prioridade</Label>
                <Checkbox
                    type="checkbox"
                    id="priority"
                    name="priority"
                    checked={task.priority}
                    onChange={(e) => setTask(prevTask => ({
                        ...prevTask,
                        priority: e.target.checked
                    }))}
                />
            </FormField>
            <FormField>
                <Label htmlFor="state">Status</Label>
                <Select
                    id="state"
                    name="state"
                    value={task.state}
                    onChange={(e) => setTask(prevTask => ({
                        ...prevTask,
                        state: e.target.value
                    }))}
                    required
                >
                    <option value="Pendente">Pendente</option>
                    <option value="Em progresso">Em Progresso</option>
                    <option value="Concluído">Concluído</option>
                </Select>
            </FormField>
            <FormField>
                <Label htmlFor="listId">Lista</Label>
                <Select
                    id="listId"
                    name="listId"
                    value={task.listId}
                    onChange={(e) => setTask(prevTask => ({
                        ...prevTask,
                        listId: Number(e.target.value)
                    }))}
                    required
                >
                    <option value="" disabled>Selecione uma lista</option>
                    {lists.map(list => (
                        <option key={list.id} value={list.id}>
                            {list.title}
                        </option>
                    ))}
                </Select>
            </FormField>
            <Button type="submit">Salvar</Button>
            <Button type="button" onClick={handleGoBack}>Voltar</Button>
        </FormContainer>
    );
};

export default TaskEditForm;
