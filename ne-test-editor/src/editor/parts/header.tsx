import { Button, ButtonGroup, FormControl, InputGroup } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useRecoilOnChange, useRecoilReducer } from "../../hooks";
import { NE_CONFIG_STATE, NE_DATA_STATE } from "../../state";
import { NE_DATA_REDUCER } from "../reducer";
import { Icon } from "./icon";
import { HeaderTemplate } from "./template";

type HeaderProps = {
  disabled?: boolean;
};

export const EditorHeader = (props: HeaderProps) => {
  const { disabled } = props;
  const value = useRecoilValue(NE_CONFIG_STATE);
  const onChange = useRecoilOnChange(NE_CONFIG_STATE);
  const onDispatch = useRecoilReducer(NE_DATA_REDUCER, NE_DATA_STATE);
  // const onDispatch = useRecoilReducer(NE_CONFIG_REDUCER, NE_CONFIG_STATE);
  const onClick = (event: any) => {
    const { name, value } = event.target;
    onDispatch({ type: name, value });
  };
  return (
    <HeaderTemplate>
      <InputGroup size="sm">
        <InputGroup.Text className="w-label">Input File</InputGroup.Text>
        <FormControl
          name="source"
          value={value.source}
          onChange={onChange}
          placeholder="Source File"
          disabled={disabled}
        />
        <ButtonGroup size="sm" className="w-action">
          <Button
            name="run:build"
            variant="outline-success"
            onClick={onClick}
            disabled={disabled}
          >
            <Icon name="hammer" />
            Build now
          </Button>
        </ButtonGroup>
        <InputGroup.Text className="w-timeout">
          {value.buildTime}
        </InputGroup.Text>
      </InputGroup>
      <InputGroup size="sm">
        <InputGroup.Text className="w-label">Output File</InputGroup.Text>
        <FormControl
          name="target"
          value={value.target}
          onChange={onChange}
          placeholder="Target File"
          disabled={disabled}
        />
        <ButtonGroup size="sm" className="w-action">
          <Button
            name="run:all"
            variant="outline-danger"
            onClick={onClick}
            disabled={disabled}
          >
            <Icon name="play" />
            Ejecute All
          </Button>
          <Button
            name="item:add"
            variant="outline-primary"
            onClick={onClick}
            disabled={disabled}
          >
            <Icon name="plus" />
            Add Test Case
          </Button>
        </ButtonGroup>
        <InputGroup.Text className="w-timeout">{value.runTime}</InputGroup.Text>
      </InputGroup>
    </HeaderTemplate>
  );
};
