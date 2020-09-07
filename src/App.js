import React, { useState, useEffect, Fragment } from 'react';
import './App.css';

function App() {
  const [files, setFiles] = useState({});
  const [inputValue, setInput] = useState('');
  const [fileValue, setfile] = useState(null);
  useEffect(() => {
    getFiles();
  }, []);

  /**
   * This method used for fetch uploaded files information
   */
  const getFiles = async () => {
    const getFilesReq = await fetch(`${window.location.host.includes('localhost') ? 'http://localhost:8000/' : '/'}files`);
    const getFilesRes = await getFilesReq.json();
    setFiles(getFilesRes);
  };

  /**
   * This method used for toggle path tree
   */
  const onToggle = (e) => {
    e.preventDefault();
    e.target.parentElement.querySelector(".nested").classList.toggle("active");
    e.target.classList.toggle("caret-down");
  }


  /**
   * This method used for render tree node in html
   */
  const renderTreeNode = (node) => {
    if (typeof node === 'object' && Object.keys(node).length) {
      console.log(node)
      return (
        <Fragment>
          <ul className="nested" >
            {Object.keys(node).map((nodeName, index) => {
              console.log(nodeName);
              return (
                <li>
                  {typeof node[nodeName] === 'object' ? <span onClick={(e) => onToggle(e)} className="caret">{nodeName}</span> : <span className="">{nodeName}</span>}
                  {typeof node[nodeName] === 'object' && renderTreeNode(node[nodeName])}
                </li>
              )
            })}
          </ul>
        </Fragment>
      )
    }
  };

  /**
   * This method used for submit new file with validation
   */
  const onSubmit = async () => {
    const reg = /^([a-zA-Z0-9]*)_([a-zA-Z0-9]*)_([a-zA-Z0-9]*)$/;
    if (!reg.test(inputValue)) {
      return alert('Please provide file name like \"PROJECTNAME_SHOTNAME_TASKNAME\"');
    }
    const formData = new FormData();
    formData.append('doc', fileValue)
    formData.append('filePath', inputValue)
    const setFilesReq = await fetch(`${window.location.host.includes('localhost') ? 'http://localhost:8000/' : '/'}upload`, {
      method: 'POST',
      body: formData
    });
    const setFilesRes = await setFilesReq.json();
    setInput('');
    setfile(null);
    setFiles(setFilesRes);

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
        {Object.keys(files).map((nodeName, index) => {
          return (
            <li key={`${nodeName}_${index}`}><span onClick={(e) => onToggle(e)} className="caret">{nodeName}</span>
              {renderTreeNode(files[nodeName])}
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default App;
