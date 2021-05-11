import { ObjectInspector } from 'react-inspector';
import { handlerOnKey } from '_/helpers/handler'
import { useConfigHandler } from "_/hooks/useConfigHandler"


export const Tester = () => {
  const [config, , event] = useConfigHandler();
  return (
    <div className="me-template">
      <Header model={config} event={event} />
      <div className="content">
        {
          config.items && config.items.map((item, ix) => (
            <div className="case border"
              key={'case-' + item.id}>
              <ItemTitle item={item} event={event} prefix={`items.${ix}.`} />
              {(config.execute === item.id || config.execute === 'ALL') &&
                <>
                  <ItemStatus item={item} />
                  <ItemContent item={item} event={event} prefix={`items.${ix}.`} />
                </>
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}

const ItemContent = ({ item, event, prefix }) => {

  const onExecute = (e, id) => event.onExecuteTest(id)

  const onExecuteKey = handlerOnKey('Ctrl+Enter', onExecute)

  const resizeHeight = (e) => {
    const el = e.target;
    el.style.height = 0
    el.style.height = el.scrollHeight + 'px'
  }
  return (
    <div className="content">
      <textarea
        name={prefix + 'content'}
        value={item.content}
        onChange={event.onChange}
        rows={1}
        onKeyDown={e => onExecuteKey(e, item.id)}
        onKeyUp={resizeHeight}
        className="textarea-input" />
      <code className="output border-top">
        {
          item.results &&
          item.results.map((it, ix) => (
            <div className="result" key={'result-' + ix}>
              <ObjectInspector name={'Result ' + ix} data={it} />
            </div>
          ))
        }
        {
          item.traces &&
          item.traces.map((it, ix) => (
            <div className="trace" key={'trace-' + ix}>
              <ObjectInspector
                name={it.charAt}
                data={it.rules}
                showNonenumerable={false}
                nodeRenderer={a => a.depth === 0 ? <b>Trace Char: '{a.name}'</b> : <span>{a.data}</span>} />
            </div>
          ))
        }
        {
          item.output &&
          <pre className="text-danger" onClick={e => e.target.classList.toggle('expand')}>{item.output}</pre>
        }
      </code>
    </div>
  )
}

const ItemStatus = ({ item }) => {
  return (
    <div className="status bg-light">
      {
        item.status === 'success'
        &&
        <div className="case-status bg-success">
          <i className="icon-ok text-white" />
        </div>
      }
      {
        item.status === 'error'
        &&
        <div className="case-status bg-danger">
          <i className="icon-error text-white" />
        </div>
      }
    </div>
  )
}

const ItemTitle = ({ prefix = '', item, event }) => {
  return (
    <div className="title bg-light">
      <div className="input-group input-group-sm">
        <input
          name={prefix + 'name'}
          value={item.name}
          onChange={event.onChange}
          onClick={e => event.onActiveTest(item)}
          className="form-control bg-light" />

        <label className="btn btn-outline-dark">
          <input
            name={prefix + 'trace'}
            value={item.trace}
            onChange={event.onChange}
            type="checkbox"
            className="form-check-input" />
          <i className="icon-bug" />
        </label>
        <button onClick={e => event.onExecuteTest(item.id)}
          className="btn btn-outline-primary">
          <i className="icon-run" />
        </button>
        <button onClick={e => event.onRemoveTest(item)}
          className="btn btn-sm btn-outline-danger">
          <i className="icon-trash" />
        </button>
      </div>
    </div>
  )
}

const Header = ({ model: config, event }) => {
  return (
    <div className="header">
      <div className="input-group input-group-sm ">
        <span className="input-group-text">Grammar File</span>
        <input name="grammar"
          value={config.grammar}
          onChange={event.onChange}
          className="form-control bg-white" />
        <button onClick={e => event.onExecuteTest('ALL')}
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
  )
}
