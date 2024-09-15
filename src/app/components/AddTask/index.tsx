import { useState, useEffect } from "react";
import Button from "../Button";
import Tasks from "@/app/interfaces/tasks";
import {
    Form,
    ErrorMessage,
    Select,
    Input,
    Textarea,
    CheckboxLabel,
} from "./styles";
import { api } from "@/app/services/api";
import Lists from "@/app/interfaces/lists";

interface AddTaskProps {
    addTask: (listId: number, task: Tasks) => void;
}

const AddTask = ({ addTask }: AddTaskProps) => {
    const [lists, setLists] = useState<Lists[]>([]);
    const [listId, setListId] = useState<number | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState(false);
    const [state, setStatus] = useState<string>("Pendente");
    const [error, setError] = useState("");
    useEffect(() => {
        api
            .get("/api/lists")
            .then((response) => {
                setLists(response.data);
                if (response.data.length > 0) {
                    setListId(response.data[0].id);
                }
            })
            .catch((error) => {
                console.error("Erro ao buscar listas:", error);
            });

    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (title.length <= 5) {
            setError("O título deve ter mais de 5 caracteres.");
            return;
        }
        if (description.length <= 5) {
            setError("A descrição deve ter mais de 5 caracteres.");
            return;
        }

        if (listId && title) {
            const newTask: Tasks = {
                title,
                description,
                priority,
                state,
                listId: listId,
                id: 0,
                createdAt: "",
                updatedAt: ""
            };

            if (addTask) {
                addTask(listId, newTask);
            }

            try {
                await api.post(`/api/items/list/${listId}`, newTask);
                setTitle("");
                setDescription("");
                setPriority(false);
                setStatus("Pendente");
            } catch (error) {
                console.error("Erro ao adicionar tarefa:", error);
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Select
                value={listId}
                onChange={(e) => setListId(Number(e.target.value))}
                required
            >
                <option value="" disabled>
                    Selecione uma lista
                </option>
                {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                        {list.title}
                    </option>
                ))}
            </Select>
            <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da tarefa"
                required
            />
            <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição da tarefa"
            />
            <CheckboxLabel>
                <label>Prioridade?</label>
                <Input
                    type="checkbox"
                    checked={priority}
                    onChange={(e) => setPriority(e.target.checked)}
                />
            </CheckboxLabel>
            <Select
                value={state}
                onChange={(e) =>
                    setStatus(e.target.value)
                }
            >
                <option value="Pendente">Pendente</option>
                <option value="Em progresso">Em Progresso</option>
                <option value="Concluído">Concluído</option>
            </Select>
            <Button type="submit">Adicionar Tarefa</Button>
        </Form>
    );
};

export default AddTask;
