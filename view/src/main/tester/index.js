import { useState } from 'react';
import { ObjectInspector } from 'react-inspector';
import { handlerList, handlerOnKey } from '_/helpers/handler'

const INIT = {
  grammar: 'aaa.js',
  hash: '00000001111',
  active: 0,
  tests: [{ id: '0', name: 'Test-0', content: '1+1' }]
}
export const Tester = () => {
  const [config, setConfig] = useState(INIT);

  const setConfigTest = (setTest) => {
    setConfig(state => {
      return {
        ...state,
        tests: setTest(state.tests)
      }
    })
  }

  const handler = handlerList('id', setConfigTest);

  const onExecute = (e, it) => {
    it.result = [Math.random(), it.result, Math.random()];
    handler.update(it);
  }

  const onExecuteKey = handlerOnKey('Ctrl+Enter', onExecute)

  const resizeHeight = (e) => {
    const el = e.target;
    el.style.height = 0
    el.style.height = (el.scrollHeight + 15) + 'px'

  }

  const onActive = (ix) => {
    setConfig(state => {
      return { ...state, active: ix }
    })
  }
  const onAppend = () => {
    handler.append({ name: 'Test-' + config.tests.length, content: "1+2", result: [] })
    onActive(0);
  }

  return (
    <div className="me-template">
      <div className="gramar">
        <div className="input-group input-group-sm ">
          <span className="input-group-text" id="basic-addon2">File Name</span>
          <input className="form-control bg-white" value={config.grammar} readOnly />
          <span className="input-group-text" id="basic-addon2">Hash</span>
          <input className="form-control bg-white" value={config.hash} readOnly />
          <span className="input-group-text" id="basic-addon2">Date</span>
          <input className="form-control bg-white" value={config.hash} readOnly />
          <button onClick={onAppend}
            className="btn btn-sm btn-primary">
            <i className="icon-plus" />
            Add Test Case
          </button>
        </div>
      </div>
      <div className="content">
        {
          config.tests.map((it, ix) => (
            <div className="case card"
              onClick={e => onActive(ix)}
              key={'case-' + it.id}>
              <input
                name={ix + '.name'}
                value={it.name}
                onChange={handler.onChange}
                className="input-title card-header text-dark" />

              {config.active === ix &&
                <>
                  <div className="actions card-footer">
                    <button onClick={e => handler.remove(it)}
                      className="btn btn-sm btn-danger">
                      <i className="icon-trash" />
                      Remove
                    </button>
                    <button onClick={e => onExecute(e, it)}
                      className="btn btn-sm btn-primary">
                      <i className="icon-run" />
                      Ejecute
                    </button>
                    <i className="icon-2x icon-ok text-success" />
                    <i className="icon-2x icon-error text-danger" />
                  </div>
                  <div className="content">
                    <textarea
                      name={ix + '.content'}
                      value={it.content}
                      onChange={handler.onChange}
                      onKeyUp={e => onExecuteKey(e, it)}
                      onKeyDown={resizeHeight}
                      className="textarea-input"
                      title="Ctrl+Enter for execute this case test" />
                    <code className="output  border-top">
                      {
                        it.result && it.result.map((ir, irx) => (
                          <div className="result" key={'result-' + irx}>
                            <ObjectInspector data={ir} />
                          </div>
                        ))
                      }
                    </code>
                  </div>
                </>
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}
