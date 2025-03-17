import * as S from "./styles"; // Importar os estilos


const Modal = ({ children, isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      {isOpen && (
        <S.Overlay onClick={handleClose}>
          <S.Container onClick={(e) => e.stopPropagation()}>
            {children}
            <S.Button onClick={handleClose}>Fechar</S.Button>
          </S.Container>
        </S.Overlay>
      )}
    </>
  );
};

export default Modal;