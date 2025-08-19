
import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  box-sizing: border-box;
  padding: 0;
  overflow-x: hidden;
`;

export const HeaderHome = styled.div`
  margin-top: 40px;
  margin-bottom: 24px;
  text-align: center;
`;

export const TitleHome = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #2d3a4b;
  margin-bottom: 8px;
`;

export const SubtitleHome = styled.h2`
  font-size: 1.2rem;
  font-weight: 400;
  color: #4a5a6a;
  margin-bottom: 0;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 900px;
  padding: 24px;
  box-sizing: border-box;
`;

export const CardButton = styled.button`
  background: #fff;
  border: none;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 #0001;
  padding: 32px 16px 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  min-height: 160px;
  min-width: 0;
  outline: none;
  &:hover, &:focus {
    box-shadow: 0 4px 24px 0 #0002;
    transform: translateY(-4px) scale(1.03);
  }
`;

export const CardIcon = styled.div`
  color: #3b82f6;
  margin-bottom: 16px;
`;

export const CardLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3a4b;
`;
