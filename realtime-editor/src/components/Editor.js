import React, { useEffect , useRef} from 'react'
import CodeMirror from 'codemirror';
import { json } from 'react-router-dom';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';


const Editor = ({socketRef,roomId,onCodeChange}) => {
    const editorRef = useRef(null);
    useEffect(() => {
        async function init(){
            editorRef.current = CodeMirror.fromTextArea(document.getElementById('realtimeEditor'),{
            mode: {name: 'javascript', json:true},
            theme: 'dracula',
            lineNumbers: true,
            autoCloseTags:true,
            autoCloseBrackets : true,
        });

           editorRef.current.on('change',(instance,changes)=>{
            console.log('changes',changes);
            const {origin} = changes;
            const code = instance.getValue();
            onCodeChange(code);
            if(origin!=='setValue'){
                socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                    roomId,
                    code,
                });
            }
            console.log(code);
        });

       
    }
        init();
    },[]);

    useEffect(() => {
      if (socketRef && socketRef.current) {
        socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
          if (code !== null) {
            if (editorRef && editorRef.current) {
              editorRef.current.setValue(code);
            }
          }
        });
      }

      return() =>{
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      };
    },[socketRef.current]);

    return <textarea id="realtimeEditor"></textarea>
}

export default Editor
 