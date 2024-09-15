"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AddList from "./components/AddList";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import Modal from "./components/Modal";
import { api } from "@/app/services/api";
import Link from "next/link";
import GlobalStyles from "./global/GlobalStyles";
import Tasks from "./interfaces/tasks";
import Lists from "./interfaces/lists";

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ListSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ListSelect = styled.select`
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  background-color: ${(props) =>
        props.color === "list" ? "#4CAF50" : "#2196F3"};
  color: white;

  &:hover {
    opacity: 0.8;
  }
`;

const StateSelect = styled.select`
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
  width: 100%;
`;

export default function Home() {
    const [lists, setLists] = useState<Lists[]>([]);
    const [filteredLists, setFilteredLists] = useState(lists);
    const [searchTaskTitle, setSearchTaskTitle] = useState("");
    const [taskState, setTaskState] = useState("");
    const [selectedListId, setSelectedListId] = useState<number>();
    const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState<Tasks[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        api
            .get("/api/lists")
            .then((response) => {
                setLists(response.data);
                setFilteredLists(response.data);
                if (response.data.length > 0) {
                    setSelectedListId(response.data[0].id);
                }
            })
            .catch((error) => {
                console.error("Erro ao carregar listas:", error);
            });
    }, []);

    useEffect(() => {
        if (selectedListId) {
            api
                .get(`/api/items/list/${selectedListId}`)
                .then((response) => {
                    setFilteredTasks(response.data);
                })
                .catch((error) => console.error("Erro ao carregar tarefas:", error));
        }
    }, [selectedListId]);

    const handleAddList = (listId: number) => {
        api
            .get("/api/lists")
            .then((response) => {
                setLists(response.data);
                setFilteredLists(response.data);
                setSelectedListId(listId);
                setMessage("Lista adicionada com sucesso!"); // Mensagem de sucesso
            })
            .catch((error) => {
                console.error("Erro ao atualizar listas:", error);
                setMessage("Erro ao adicionar lista."); // Mensagem de erro
            });
    };

    const handleAddTask = (listId: number) => {
        if (!listId) return;

        api
            .get(`/api/items/list/${listId}`)
            .then((response) => {
                setFilteredTasks(response.data);
                setMessage("Tarefa adicionada com sucesso!"); // Mensagem de sucesso
            })
            .catch((error) => {
                console.error("Erro ao atualizar tarefas:", error);
                setMessage("Erro ao adicionar tarefa."); // Mensagem de erro
            });
    };

    const searchTasksByTitle = () => {
        if (selectedListId && searchTaskTitle) {
            api
                .get(`/api/items/search?title=${searchTaskTitle}`)
                .then((response) => {
                    setFilteredTasks(response.data);
                })
                .catch((error) =>
                    console.error("Erro ao buscar tarefas por título:", error)
                );
        }
    };

    const searchTasksByState = () => {
        if (selectedListId && taskState) {
            api
                .get(`/api/items/state?state=${taskState}`)
                .then((response) => {
                    setFilteredTasks(response.data);
                })
                .catch((error) =>
                    console.error("Erro ao buscar tarefas por estado:", error)
                );
        }
    };

    return (
        <>
            <Container>
                <GlobalStyles />
                <Header>Gerenciador de Tarefas</Header>
                <Main>
                    <h2>Cadastros de itens e listas</h2>
                    <ListSection>
                        <Button color="list" onClick={() => setIsAddListModalOpen(true)}>
                            Adicionar Lista
                        </Button>

                        <Modal
                            isOpen={isAddListModalOpen}
                            onClose={() => setIsAddListModalOpen(false)}
                        >
                            <AddList addList={handleAddList} />
                        </Modal>

                        <Button color="task" onClick={() => setIsAddTaskModalOpen(true)}>
                            Adicionar Tarefa
                        </Button>

                        {/* Exibe a mensagem */}
                        {message && <p>{message}</p>}

                        <Modal
                            isOpen={isAddTaskModalOpen}
                            onClose={() => setIsAddTaskModalOpen(false)}
                        >
                            <AddTask
                                addTask={(listId: number) => {
                                    handleAddTask(listId);
                                    setIsAddTaskModalOpen(false);
                                }}
                            />
                        </Modal>

                        <label>Lista selecionada:</label>
                        <ListSelect
                            value={selectedListId || ""}
                            onChange={(e) => setSelectedListId(Number(e.target.value))}
                        >
                            <option value="" disabled>
                                Selecione uma lista
                            </option>
                            {filteredLists.map((list) => (
                                <option key={list.id} value={list.id}>
                                    {list.title}
                                </option>
                            ))}
                        </ListSelect>
                        <Link href="/lists">
                            <Button color="task">Visualizar listas cadastradas</Button>
                        </Link>

                        {/* Campo de busca por título de tarefa */}
                        <h3>Pesquisas</h3>
                        <SearchInput
                            type="text"
                            placeholder="Buscar tarefa por título"
                            value={searchTaskTitle}
                            onChange={(e) => setSearchTaskTitle(e.target.value)}
                        />
                        <Button color="task" onClick={searchTasksByTitle}>
                            Buscar Tarefas por Título
                        </Button>

                        {/* Campo de seleção para o estado de tarefa */}
                        <StateSelect
                            value={taskState}
                            onChange={(e) => setTaskState(e.target.value)}
                        >
                            <option value="">Selecione o estado da tarefa</option>
                            <option value="PENDENTE">Pendente</option>
                            <option value="EM_PROGRESSO">Em Progresso</option>
                            <option value="CONCLUIDO">Concluída</option>
                        </StateSelect>
                        <Button color="task" onClick={searchTasksByState}>
                            Buscar Tarefas por Estado
                        </Button>

                        {selectedListId && (
                            <TaskList listId={selectedListId} tasks={filteredTasks} />
                        )}
                    </ListSection>
                </Main>
            </Container>
        </>
    );
}
