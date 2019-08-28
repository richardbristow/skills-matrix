import styled from 'styled-components/macro';

const StyledMain = styled.div`
  grid-area: main;
  padding: 60px 20px 20px 20px;
  margin: ${({ centre }) => (centre ? '20px auto' : '20px')};
  h2:first-of-type {
    padding-bottom: 20px;
  }
`;

export default StyledMain;
