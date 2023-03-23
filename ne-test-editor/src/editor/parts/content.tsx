import {
  Button,
  ButtonGroup,
  Card,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { ObjectInspector } from "react-inspector";
import { useRecoilValue } from "recoil";
import { useRecoilOnChange, useRecoilReducer } from "../../hooks";
import { NE_DATA_STATE, NE_ITEMS_STATE } from "../../state";
import { NE_DATA_REDUCER } from "../reducer";
import { Icon } from "./icon";
import { ItemTemplate } from "./template";

type ContentProps = {};

export const EditorContent = (props: ContentProps) => {
  const value = useRecoilValue(NE_ITEMS_STATE);
  const onChange = useRecoilOnChange(NE_ITEMS_STATE);
  const onDispatch = useRecoilReducer(NE_DATA_REDUCER, NE_DATA_STATE);
  // const onDispatch = useRecoilReducer(NE_ITEM_REDUCER, NE_ITEMS_STATE);
  const onClick = (event: any) => {
    const { name, value } = event.target;
    onDispatch({ type: name, value });
  };

  const onResizeHeight = (event: any) => {
    const el = event.target;
    el.style.height = 0;
    el.style.height = el.scrollHeight + "px";
    console.log(">>>>>", el.scrollHeight);
  };
  return (
    <section>
      {value.map((it, ix) => (
        <ItemTemplate key={it.id}>
          <InputGroup size="sm">
            <ButtonGroup size="sm" className="w-label">
              <Button variant={COLOR.STATE2[it.status]}>
                <Icon name={ICON.STATE[it.status]} color="white" />
              </Button>
              <Button
                name="item:up"
                value={it.id}
                variant="outline-secondary"
                onClick={onClick}
              >
                <Icon name="up-big" />
              </Button>
              <Button
                name="item:down"
                value={it.id}
                variant="outline-secondary"
                onClick={onClick}
              >
                <Icon name="down-big" />
              </Button>
            </ButtonGroup>
            <FormControl
              placeholder="Case Test"
              name={`${ix}.name`}
              value={it.name}
              onChange={onChange}
            />
            <ButtonGroup size="sm" className="w-action">
              <Button
                name="item:open-toggle"
                value={it.id}
                variant={it.open ? "outline-primary" : "outline-dark"}
                size="sm"
                onClick={onClick}
              >
                <Icon name={it.open ? "down-open" : "right-open"} />
              </Button>
              <Button
                name="item:trace-toggle"
                value={it.id}
                variant={it.trace ? "outline-dark" : "outline-secondary"}
                onClick={onClick}
              >
                <Icon name="bug" />
              </Button>
              <Button
                name="run:item"
                value={it.id}
                variant="outline-dark"
                onClick={onClick}
              >
                <Icon name="play" />
              </Button>
              <Button
                name="item:remove"
                value={it.id}
                variant="outline-danger"
                onClick={onClick}
              >
                <Icon name="trash" />
              </Button>
            </ButtonGroup>
            <InputGroup.Text className="w-timeout">
              {it.runTime}
            </InputGroup.Text>
          </InputGroup>
          {it.open && (
            <Card>
              <Card.Body>
                <Card.Header className="input">Input</Card.Header>
                <FormControl
                  placeholder="Case Test"
                  name={`${ix}.input`}
                  value={it.input}
                  onChange={onChange}
                  as="textarea"
                  onKeyUp={onResizeHeight}
                  onFocus={onResizeHeight}
                />
                <Card.Header className={COLOR.BG[it.status]}>
                  Output
                </Card.Header>
                <div className="form-control">
                  {it.output?.map((it1, ix) => {
                    return (
                      <ObjectInspector
                        key={"out-" + ix}
                        name={"Output " + ix}
                        data={it1}
                      />
                    );
                  })}
                </div>
                {it.trace && (
                  <>
                    <Card.Header className="traces">Traces</Card.Header>
                    <div className="form-control">
                      <ObjectInspector data={it.traces} />
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </ItemTemplate>
      ))}
    </section>
  );
};

const ICON = {
  STATE: {
    success: "ok",
    error: "attention",
    unknow: "help-circled",
  },
};
const COLOR = {
  STATE: {
    success: "outline-success",
    error: "outline-danger",
    unknow: "outline-dark",
  },
  BG: {
    success: "bg-success",
    error: "bg-danger",
    unknow: "bg-dark",
  },
  STATE2: {
    success: "success",
    error: "danger",
    unknow: "outline-dark",
  },
};
