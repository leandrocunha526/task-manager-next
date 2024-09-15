import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '@/app/services/api';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/Button';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  box-sizing: border-box;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  box-sizing: border-box;
`;

const ListItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  background: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const Header = styled.h1`
  margin: 0;
`;

const Title = styled.h2`
  margin: 0;
`;

const Description = styled.p`
  margin: 5px 0 0;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  width: 100%;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #0070f3;
    outline: none;
  }
`;

const EditInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  width: 100%;
  transition: border-color 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #0070f3;
    outline: none;
  }
`;

const EditDescription = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  width: 100%;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #0070f3;
    outline: none;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const SuccessMessage = styled.p`
  color: green;
  margin-bottom: 20px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;  // Centraliza horizontalmente
  align-items: center;      // Centraliza verticalmente
  z-index: 1000;
`;


const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 100%;
  text-align: center;
  max-height: 90vh; /* Limita a altura máxima do modal */
  overflow-y: auto; /* Habilita a rolagem, se necessário */
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const WarningBox = styled.div`
  width: 360px;
  padding: 10px;
  height: 60px;
  background-color: #fff3cd; /* Cor de fundo de advertência */
  border: 1px solid #ffeeba; /* Borda de advertência */
  border-radius: 6px;
  color: #856404; /* Cor do texto de advertência */
  font-size: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;

  &:hover {
    border-color: #ffdd57;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const WarningText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
`;


const ListsPage: React.FC = () => {
  const [lists, setLists] = useState<{ id: number; title: string; description: string }[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [editListId, setEditListId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<number | null>(null);
  const router = useRouter();

  const fetchLists = async () => {
    try {
      const response = await api.get('/api/lists');
      setLists(response.data);
    } catch (error) {
      setError('Erro ao carregar listas: ' + error.message);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const openModal = (listId: number) => {
    setIsModalOpen(true);
    setListToDelete(listId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setListToDelete(null);
  };

  const handleDelete = async () => {
    if (listToDelete === null) return;

    try {
      await api.delete(`/api/lists/${listToDelete}`);
      setLists((prevLists) => prevLists.filter((list) => list.id !== listToDelete));
      closeModal();
    } catch (error) {
      setError('Erro ao excluir a lista: ' + error.message);
    }
  };

  const handleUpdate = async (listId: number) => {
    if (editTitle.length < 5 || editDescription.length < 5) {
      setValidationError('O título e a descrição devem ter no mínimo 5 caracteres.');
      return;
    }
    try {
      await api.put(`/api/lists/${listId}`, {
        title: editTitle,
        description: editDescription,
      });
      fetchLists();
      setEditListId(null);
      setEditTitle('');
      setEditDescription('');
      setValidationError('');
      setSuccessMessage('Salvo com sucesso!');
      // Limpa a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setError('Erro ao atualizar a lista: ' + error.message);
    }
  };

  const handleSearchByTitle = async () => {
    try {
      const response = await api.get('/api/lists/search/title', { params: { keyword: searchTitle } });
      setLists(response.data);
    } catch (error) {
      setError('Erro ao buscar listas por título: ' + error.message);
    }
  };

  const handleSearchByDescription = async () => {
    try {
      const response = await api.get('/api/lists/search/description', { params: { keyword: searchDescription } });
      setLists(response.data);
    } catch (error) {
      setError('Erro ao buscar listas por descrição: ' + error.message);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Container>
        <Button onClick={() => router.back()} color="#2196F3" hoverColor="#1976D2">
          Voltar
        </Button>
        <Header>Listagem de Listas</Header>

        {/* Exibe a mensagem de sucesso se ela existir */}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        <div>
          <SearchInput
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Buscar por título"
          />
          <Button onClick={handleSearchByTitle} color="#0070f3" hoverColor="#005bb5">
            Buscar por Título
          </Button>
        </div>

        <div>
          <SearchInput
            type="text"
            value={searchDescription}
            onChange={(e) => setSearchDescription(e.target.value)}
            placeholder="Buscar por descrição"
          />
          <Button onClick={handleSearchByDescription} color="#0070f3" hoverColor="#005bb5">
            Buscar por Descrição
          </Button>
        </div>

        <ListContainer>
          {lists.length === 0 ? (
            <p>Nenhuma lista encontrada.</p>
          ) : (
            lists.map((list) => (
              <ListItem key={list.id}>
                {editListId === list.id ? (
                  <>
                    <div>
                      <EditInput
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Editar título"
                      />
                      <EditDescription
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Editar descrição"
                      />
                      {validationError && <ErrorMessage>{validationError}</ErrorMessage>}
                    </div>
                    <Button onClick={() => handleUpdate(list.id)} color="#4CAF50" hoverColor="#388E3C">
                      Salvar
                    </Button>
                    <Button onClick={() => setEditListId(null)} color="#f44336" hoverColor="#d32f2f">
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <Title>{list.title}</Title>
                      <Description>{list.description}</Description>
                    </div>
                    <div>
                      <Button
                        onClick={() => {
                          setEditListId(list.id);
                          setEditTitle(list.title);
                          setEditDescription(list.description);
                        }}
                        color="#2196F3"
                        hoverColor="#1976D2"
                      >
                        Editar
                      </Button>
                      <Button onClick={() => openModal(list.id)} color="#f44336" hoverColor="#d32f2f">
                        Excluir
                      </Button>
                    </div>
                  </>
                )}
              </ListItem>
            ))
          )}
        </ListContainer>
      </Container>

      {/* Modal de confirmação para exclusão */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <p>Tem certeza que deseja excluir esta lista?</p>
            <WarningBox>
              <WarningText>
                Esta ação irá excluir todas as tarefas associadas nesta lista.
              </WarningText>
            </WarningBox>
            <ModalButtons>
              <Button onClick={handleDelete} color="#f44336" hoverColor="#d32f2f">
                Excluir
              </Button>
              <Button onClick={closeModal} color="#2196F3" hoverColor="#1976D2">
                Cancelar
              </Button>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ListsPage;
