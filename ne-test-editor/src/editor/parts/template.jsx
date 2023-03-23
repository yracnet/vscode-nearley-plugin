import styled from "styled-components";

export const HeaderTemplate = styled.section`
  display: flex;
  flex-direction: column;
  gap: 5px 0px;
  margin: 10px;
  input[disabled] {
    background: transparent;
  }
  .w-label {
    width: 100px;
  }
  .w-icon {
    width: 20px;
  }
  .w-action {
    width: 180px;
  }
  .w-timeout {
    width: 80px;
    background-color: var(--bs-warning);
    text-align: right;
  }
`;

export const ItemTemplate = styled(HeaderTemplate)`
  gap: 0px 0px;
  > .container {
    margin: 0;
    border: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color) !important;
    border-top: 0 !important;
    max-width: 100%;
    width: 100%;
  }
  > .card {
    padding: 0;
    margin: 3px 0 5px 0;
    border: 0;
    .card-body {
      padding: 0;
      margin: 0;
    }
    .card-header {
      color: white;
      font-weight: bold;
      &.input {
        background-color: var(--bs-blue);
      }
      &.traces {
        background-color: var(--bs-dark);
      }
    }
    code.output > pre {
      max-height: 200px;
    }
  }
`;
