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
  const [fileValue, setfile] = useState(null);
  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    const getFilesReq = await fetch(`${window.location.host.includes('localhost') ? 'http://localhost:8000/' : '/'}files`);
    const getFilesRes = await getFilesReq.json();
    console.log(getFilesRes);
  };

  const onToggle = (e) => {
    console.log('call')
    e.preventDefault();
    e.target.parentElement.querySelector(".nested").classList.toggle("active");
    e.target.classList.toggle("caret-down");
  }



  const renderTreeNode = (nodeName, node) => {
    if (typeof node === 'object' && Object.keys(node).length) {
      return (
        <Fragment>
          {Object.keys(node).map((nodeName) => {
            return (
              <ul className="nested">
              <li>
                {typeof node[nodeName] === 'object' ? <span  onClick={(e) => onToggle(e)}  className="caret">{nodeName}</span> : <span className="">{nodeName}</span>}
                {renderTreeNode(nodeName, node[nodeName])}
              </li>
            </ul>
            )
          })}
        </Fragment>
      )
    }
  };
  const onSubmit = async () => {
    const formData = new FormData();
    formData.append('doc', fileValue)
    formData.append('filePath', inputValue)
    const setFilesReq = await fetch(`${window.location.host.includes('localhost') ? 'http://localhost:8000/' : '/'}upload`, {
      method: 'POST',
      body: formData
    });
    const setFilesRes = await setFilesReq.json();
    console.log(setFilesRes);

  }
  return (

    <div className="App">
      <div className="d-flex">
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}>
          <div className="autocomplete">
            <div className="search-input">
              <input id="myInput" type="text" value={inputValue} placeholder="eg: PROJECTNAME_SHOTNAME_TASKNAME" onChange={(e) => setInput(e.target.value)} />
              <input id="myInput" type="file" onChange={(e) => setfile(e.target.files[0])} />
              <input disabled={!inputValue || !inputValue.trim().length || !fileValue} type="submit" value="Execute" />
              <input type="button" value="Cancel" onClick={() => {
                setInput('');
                setfile(null)
              }} />
            </div>
          </div>
        </form>
      </div>
      <ul id="myUL" >
        {Object.keys(files).map((nodeName) => {
          return (
            <li><span onClick={(e) => onToggle(e)}  className="caret">{nodeName}</span>
              {renderTreeNode(nodeName, files[nodeName])}
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default App;
