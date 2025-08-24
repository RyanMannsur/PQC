// StatusMessage.js
import { useEffect, useMemo } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MessageWrapper } from './styles'; 

const colorMap = {
  SUCESSO: '#abeebaff',
  AVISO: '#ebd89cff',
  ERRO: '#ee8f97ff',
};

// Normaliza para sempre renderizar todas as mensagens
function normalizeMessages(m) {
  if (!m) return [];
  if (Array.isArray(m)) return m.filter(Boolean);
  if (typeof m === 'string') {
    return m
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
  }
  try {
    return [String(m)];
  } catch {
    return [];
  }
}

const StatusMessage = ({ message, onClose, autoHideMs = 5000 }) => {
  const tipo = message?.tipo ?? 'ERRO';
  const bgColor = colorMap[tipo] || '#ee8f97ff';

  const msgs = useMemo(() => normalizeMessages(message?.mensagem), [message]);

  // Oculta automaticamente
  useEffect(() => {
    if (message && autoHideMs > 0) {
      const t = setTimeout(onClose, autoHideMs);
      return () => clearTimeout(t);
    }
  }, [message, onClose, autoHideMs]);

  if (!message || msgs.length === 0) return null;

  return (
    <MessageWrapper style={{ backgroundColor: bgColor }} role="status" aria-live="polite">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {msgs.length > 1 ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {msgs.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        ) : (
          <span>{msgs[0]}</span>
        )}
      </div>

      <IconButton onClick={onClose} style={{ color: 'black' }} aria-label="Fechar mensagem">
        <CloseIcon />
      </IconButton>
    </MessageWrapper>
  );
};

export default StatusMessage;
