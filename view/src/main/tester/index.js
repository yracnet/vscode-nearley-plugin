import { ObjectInspector } from 'react-inspector';
import { handlerOnKey } from '_/helpers/handler'
import { useConfigHandler } from "_/hooks/useConfigHandler"


export const Tester = () => {
  const [config, , event] = useConfigHandler();

  const onExecute = (e, id) => {
    event.onExecuteTest(id)
  }

  const onExecuteKey = handlerOnKey('Ctrl+Enter', onExecute)

  const resizeHeight = (e) => {
    const el = e.target;
    el.style.height = 0
    el.style.height = el.scrollHeight + 'px'
  }

  return (
    <div className="me-template">
      <div className="header">
        <div className="input-group input-group-sm ">
          <span className="input-group-text">Grammar File</span>
          <input name="grammar"
            value={config.grammar}
            onChange={event.onChange}
            className="form-control bg-white" />
          <button onClick={e => onExecute(e, 'ALL')}
            className="btn btn-outline-danger">
            <i className="icon-run" />
            Ejecute All
          </button>
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
            <div className="case border"
              key={'case-' + it.id}>
              <div className="title bg-light">
                <div className="input-group input-group-sm">
                  <input
                    name={'tests.' + ix + '.name'}
                    value={it.name}
                    onChange={event.onChange}
                    onClick={e => event.onActiveTest(it)}
                    className="form-control bg-light" />
                  <button onClick={e => onExecute(e, it.id)}
                    className="btn btn-outline-primary">
                    <i className="icon-run" />
                  </button>
                  <button onClick={e => event.onRemoveTest(it)}
                    className="btn btn-sm btn-outline-danger">
                    <i className="icon-trash" />
                  </button>
                </div>
              </div>
              {(config.execute === it.id || config.execute === 'ALL') &&
                <>
                  <div className="status bg-light">
                    {
                      it.status === 'success'
                      &&
                      <div className="case-status bg-success">
                        <i className="icon-ok text-white" />
                      </div>
                    }
                    {
                      it.status === 'error'
                      &&
                      <div className="case-status bg-danger">
                        <i className="icon-error text-white" />
                      </div>
                    }
                  </div>
                  <div className="content">
                    <textarea
                      name={'tests.' + ix + '.content'}
                      value={it.content}
                      onChange={event.onChange}
                      rows={1}
                      onKeyUp={e => onExecuteKey(e, it.id)}
                      onKeyUp={resizeHeight}
                      className="textarea-input"
                      title="Ctrl+Enter for execute this case test" />
                    <code className="output border-top">
                      {
                        it.results && it.results.map((ir, irx) => (
                          <div className="result" key={'result-' + irx}>
                            <ObjectInspector data={ir} />
                          </div>
                        ))
                      }
                      <pre className="error text-danger">{it.error}</pre>
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
