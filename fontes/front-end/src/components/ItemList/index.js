import React, { useState } from "react";
import * as C from "./styles";
import { MoreVert } from "@mui/icons-material";

const ItemList = ({ columns, data, onInputChange, onActionSelect }) => {
  const [editableData, setEditableData] = useState(() =>
    data.map((item) => ({ ...item }))
  );
  const [openMenu, setOpenMenu] = useState(null);

  const handleInputChange = (rowIndex, key, value) => {
    const updatedData = editableData.map((item, index) =>
      index === rowIndex ? { ...item, [key]: value } : item
    );
    setEditableData(updatedData);
    if (onInputChange) onInputChange(updatedData);
  };

  const handleMenuOpen = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  return (
    <C.Table>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <C.Th key={index}>{col.label}</C.Th>
          ))}
        </tr>
      </thead>
      <tbody>
        {editableData.map((item, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => (
              <C.Td key={colIndex}>
                {col.type === "input" ? (
                  col.render ? (
                    // Se a coluna possuir render, utiliza-o (ex: Input Select)
                    col.render(item, rowIndex)
                  ) : (
                    // Caso contrário, renderiza um input normal
                    <input
                      type="text"
                      value={item[col.key]}
                      onChange={(e) =>
                        handleInputChange(rowIndex, col.key, e.target.value)
                      }
                    />
                  )
                ) : col.type === "actions" ? (
                  <div style={{ position: "relative" }}>
                    <MoreVert
                      onClick={() => handleMenuOpen(rowIndex)}
                      style={{ cursor: "pointer" }}
                    />
                    {openMenu === rowIndex && (
                      <C.ActionMenu>
                        {col.actions.map((action, actionIndex) => (
                          <C.ActionItem
                            key={actionIndex}
                            onClick={() => onActionSelect(action, item)}
                          >
                            {action.label}
                          </C.ActionItem>
                        ))}
                      </C.ActionMenu>
                    )}
                  </div>
                ) : col.type === "button" ? (
                  <C.Button onClick={() => col.onClick(item)}>
                    {col.label}
                  </C.Button>
                ) : (
                  // Para outros tipos, renderiza o valor diretamente
                  item[col.key]
                )}
              </C.Td>
            ))}
          </tr>
        ))}
      </tbody>
    </C.Table>
  );
};

export default ItemList;
