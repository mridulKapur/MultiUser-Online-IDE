import React from "react";
import AceEditor from "react-ace";
import ReactDOM from "react-dom";
import * as ace from "ace-builds";
import SocketIOClient from "socket.io-client";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-github";

const endpoint = "http://127.0.0.1:4676";
const socket = SocketIOClient(endpoint, { transports: ["websocket"] });


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeValue: ''
    }
    this.codeEditor = React.createRef();
    this.fireTyping = this.fireTyping.bind(this);
  }

  componentDidMount() {
    socket.on('typed', (data) => {
      this.setState({
        codeValue: data.text
      })
      console.log(this.codeEditor.current.editor.value)
  })
  }

  fireTyping = () => {
    
    console.log()
    socket.emit("typing", {
      text: this.codeEditor.current.editor.getValue()
    });
  };

  render() {
    return (
      <AceEditor
        ref={this.codeEditor}
        mode="c_cpp"
        theme="github"
        value={this.state.codeValue}
        onInput={this.fireTyping}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
