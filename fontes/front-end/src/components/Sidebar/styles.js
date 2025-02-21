import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const DrawerStyles = {
  width: 240,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    width: 200,
    boxSizing: "border-box",
    height: "100%",
  },
};

export const ChildrenContainer = styled.div`
  flex: 1;
  overflow: auto;
`;
