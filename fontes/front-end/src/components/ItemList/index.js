import React from "react";
import * as C from "./styles";

const ItemList = ({ data, columns, onActionClick }) => {
  return (
    <C.Table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col.key}>
                {col.type === "button" ? (
                  <C.Button onClick={() => onActionClick(item.id, col.key)}>
                    {col.label}
                  </C.Button>
                ) : col.type === "input" ? (
                  <C.Input type="text" defaultValue={item[col.key]} />
                ) : col.type === "select" ? (
                  <C.Select>
                    {item[col.key].map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </C.Select>
                ) : (
                  <span>{item[col.key]}</span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </C.Table>
  );
};

export default ItemList;
