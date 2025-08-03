import React from 'react';
import { Table, Td, Th, Tr, Button } from './styles';

const CrudTable = ({
  title,
  columns,
  data,
  onEdit,
  editText = 'Editar',
  getRowKey,
  renderActions,
}) => (
  <>
    <h2 style={{ marginTop: 40 }}>{title}</h2>
    <Table>
      <thead>
        <Tr>
          {columns.map(col => (
            <Th key={col.field}>{col.label}</Th>
          ))}
          <Th>Ações</Th>
        </Tr>
      </thead>
      <tbody>
        {data.map(item => (
          <Tr key={getRowKey(item)}>
            {columns.map(col => (
              <Td key={col.field}>
                {col.render ? col.render(item) : item[col.field]}
              </Td>
            ))}
            <Td>
              {renderActions ? (
                renderActions(item)
              ) : (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => onEdit(item)}
                >{editText}</Button>
              )}
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  </>
);

export default CrudTable;
