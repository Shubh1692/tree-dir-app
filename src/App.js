import React, { useState, useEffect, Fragment } from 'react';
import './App.css';

function App() {
  const [files, setFiles] = useState({
    "202009050707": {
      "PROJECTNAME": {
        "SHOTNAME": {
          "TASKNAME": {
            "EXE": {
              "0001": true,
              "0002": true,
              "0003": true
            }
          }
        }
      }
    }
  });
  const [inputValue, setInput] = useState('');
  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    const getFilesReq = await fetch(`${window.location.host.includes('localhost') ? 'http://localhost:8000/' : '/'}files`);
    const getFilesRes = await getFilesReq.json();
    console.log(getFilesRes);
  };

  const onToggle = (e) => {
    e.target.parentElement.querySelector(".nested").classList.toggle("active");
    e.target.classList.toggle("caret-down");
  }

  const renderTreeNode = (nodeName, node) => {
    if (typeof node === 'object' && Object.keys(node).length) {
      return (
        <Fragment>
          {Object.keys(node).map((nodeName) => {
            return (
              <div onClick={(e) => onToggle(e)}>
              <ul className="nested" onClick={(e) => onToggle(e)}>
                <li>
                  {typeof node[nodeName] === 'object' ? <span className="caret">{nodeName}</span> : <span className="">{nodeName}</span>}
                  {renderTreeNode(nodeName, node[nodeName])}
                </li>
              </ul>
              </div>
            )
          })}
        </Fragment>
      )
    }
  };
  console.log("files", files)
  return (

    <div className="App">
      <div className="d-flex">
        <form onSubmit={(e) => {
          e.preventDefault();
        }}>
          <div className="autocomplete">
            <div className="search-input">
              <input id="myInput" type="text" value={inputValue} placeholder="eg: PROJECTNAME_SHOTNAME_TASKNAME" onChange={(e) => setInput(e.target.value)} />
              <input type="submit" value="Execute" />
              <input type="button" value="Cancel" onClick={() => {
                setInput('');
              }} />
            </div>
          </div>
        </form>
      </div>
      <ul id="myUL"  onClick={(e) => onToggle(e)} >
        {Object.keys(files).map((nodeName) => {
          return (
            <Fragment>
              <li><span className="caret">{nodeName}</span>
                {renderTreeNode(nodeName, files[nodeName])} </li>
            </Fragment>
          )
        })}
      </ul>
    </div>
  );
}

export default App;
