import { useState } from 'react';
import Button from '../Button';
import { ErrorMessage, Form, Input } from './styles';
import { api } from '@/app/services/api';

const AddList = ({ addList }: { addList: (listId: number) => void }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (title.length <= 5) {
            setError('O título deve ter mais de 5 caracteres.');
            return;
        }
        if (description.length <= 5) {
            setError('A descrição deve ter mais de 5 caracteres.');
            return;
        }

        try {
            const response = await api.post('/api/lists', { title, description });
            addList(response.data.id);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Erro ao adicionar lista:', error);
            setError('Erro ao adicionar a lista. Tente novamente.');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da lista"
                required
            />
            <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição da lista"
                required
            />
            <Button type="submit">Adicionar Lista</Button>
        </Form>
    );
};

export default AddList;
