import { useState } from 'react';
import { IconButton, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StatusMessage from '../StatusMensagem';
import Modal from '../Modal';

import {
  TableWrapper,
  Table,
  Th,
  Td,
  Tr
} from "./styles";

const CrudTable = ({
  title,
  columns,
  data,
  onEdit,
  onDelete,
  getRowKey,
  renderActions,
  statusMessage,
  onCloseMessage
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = (item) => {
    setIsModalOpen(true);
    setItemToDelete(item);
  };

  const handleCancelDelete = () => {
    if (deleting) return; // Evita fechar durante exclusão
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  const handleFinalDelete = async () => {
    if (!itemToDelete || !onDelete) return;
    try {
      setDeleting(true);
      await onDelete(itemToDelete);
      setIsModalOpen(false);
      setItemToDelete(null);
    } catch (e) {
      // Mantém modal aberto; a página mostra a StatusMessage
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <h2 align="center">{title}</h2>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <Th key={index}>{col.label}</Th>
              ))}
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <Tr>
                <Td colSpan={columns.length + 1} style={{ textAlign: "center" }}>
                  Nenhum registro encontrado
                </Td>
              </Tr>
            )}
            {data.map((item) => {
              const key = getRowKey ? getRowKey(item) : item.id || Math.random();
              return (
                <Tr key={key}>
                  {columns.map((col, index) => (
                    <Td key={index}>{item[col.field]}</Td>
                  ))}
                  <Td>
                    {renderActions ? (
                      renderActions(item)
                    ) : (
                      <>
                        {onEdit && (
                          <IconButton
                            color="primary"
                            onClick={() => onEdit(item)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton
                            color="error"
                            onClick={() => handleConfirmDelete(item)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>

      {/* RENDERIZA O STATUS MESSAGE AQUI */}
      {statusMessage && (
        <StatusMessage
          message={statusMessage}
          onClose={onCloseMessage}
        />
      )}
      <Modal
        open={isModalOpen}
        onClose={handleCancelDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este item?"
        onConfirm={handleFinalDelete}
        confirmDisabled={deleting}
        confirmContent={deleting ? <CircularProgress size={20} /> : "Excluir"}
      />
    </div>
  );
};

export default CrudTable;
