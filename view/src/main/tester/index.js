import { ObjectInspector } from 'react-inspector';
import { handlerOnKey } from '_/helpers/handler'
import { useConfigHandler } from "_/hooks/useConfigHandler"

const INIT_TEST = {
  grammar: 'aaa.js',
  compiled: '01/01/01',
  hash: '00000001111',
  active: 0,
  tests: []
}

export const Tester = () => {
  const [config, , event] = useConfigHandler(INIT_TEST);

  const onExecute = (e, item) => {
    event.onExecuteTest(item)
  }

  const onExecuteKey = handlerOnKey('Ctrl+Enter', onExecute)

  const resizeHeight = (e) => {
    const el = e.target;
    el.style.height = 0
    el.style.height = (el.scrollHeight + 15) + 'px'
  }

  return (
    <div className="me-template">
      <div className="gramar">
        <div className="input-group input-group-sm ">
          <span className="input-group-text" id="basic-addon2">File Name</span>
          <input className="form-control bg-white" value={config.grammar} readOnly />
          <span className="input-group-text" id="basic-addon2">Hash</span>
          <input className="form-control bg-white" value={config.hash} readOnly />
          <span className="input-group-text" id="basic-addon2">Compiled</span>
          <input className="form-control bg-white" value={config.compiled} readOnly />
          <button onClick={e => event.onCreateTest()}
            className="btn btn-outline-primary">
            <i className="icon-plus" />
            Add Test
          </button>
        </div>
      </div>
      <div className="content">
        {
          config.tests.map((it, ix) => (
            <div className="case card"
              key={'case-' + it.id}>
              <input
                name={'tests.' + ix + '.name'}
                value={it.name}
                onChange={event.onChange}
                onClick={e => event.onActiveTest(it)}
                className="input-title card-header text-dark" />

              {config.active === it.id &&
                <>
                  <div className="actions card-footer">
                    <button onClick={e => onExecute(e, it)}
                      className="btn btn-outline-primary">
                      <i className="icon-run" />
                      Ejecute
                    </button>
                    <button onClick={e => event.onRemoveTest(it)}
                      className="btn btn-sm btn-outline-danger">
                      <i className="icon-trash" />
                      Remove
                    </button>
                    <div className="case-status bg-success">
                      <i className="icon-ok text-white" />
                    </div>
                    <div className="case-status bg-danger">
                      <i className="icon-error text-white" />
                    </div>
                  </div>
                  <div className="content">
                    <textarea
                      name={'tests.' + ix + '.content'}
                      value={it.content}
                      onChange={event.onChange}
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
