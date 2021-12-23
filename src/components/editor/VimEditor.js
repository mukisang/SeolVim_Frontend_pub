import { useEffect, useState, useRef } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import styled from 'styled-components';
import oc from 'open-color';

import { svgResize } from 'blockly';
import * as Vim from '../block/blockly_vim.js';
import Generator_vim from '../block/generator_vim.js';
import { useBlocklyWorkspace } from 'react-blockly';
import CodeOutput from './CodeOutput.js';

import { ReactComponent as Download } from './download.svg';

Vim.init();

function Blockly({
  toolbox,
  initialXml = null,
  onChange = () => {},
  onXmlChange
}) {
  const
    { ref } = useResizeDetector({
      onResize: () => {
        if(workspace)
          svgResize(workspace);
      }
    }),
    on_xml_change = useRef(onXmlChange),
    { workspace, xml } = useBlocklyWorkspace({
      ref,
      toolboxConfiguration: toolbox,
      onWorkspaceChange: onChange,
      initialXml,
      onImportXmlError: console.error
    });
  useEffect(() => {
    on_xml_change.current = onXmlChange;
  }, [onXmlChange]);
  useEffect(() => {
    if(on_xml_change.current && xml)
      on_xml_change.current(xml);
  }, [xml]);

  return <div
    ref={ref}
    style={{
      width: '100%',
      height: '100%',
      isolation: 'isolate'
    }}
  />;
}

const
  EditorWrapper = styled.div`
    position: absolute;
    left: 0;
    top: 80px;
    width: 100%;
    height: calc(100% - 80px);
  `,
  CodeToggle = styled.div`
    position: absolute;
    right: 1rem;
    top: 1rem;
    border-radius: 1.5rem;
    width: 3rem;
    height: 3rem;
    background-color: ${oc.grape[7]};
    box-shadow: 0 4px 4px rgba(0, 0, 0, 50%);
  `;

function VimEditor({ xml = null, onXmlChange }) {
  const
    [modal_open, set_modal_open] = useState(false),
    [code, set_code] = useState(''),
    [error_obj, set_error_obj] = useState(null);
  return (
    <EditorWrapper>
      <Blockly
        toolbox={Vim.toolbox}
        initialXml={xml}
        onXmlChange={onXmlChange}
//      onChange={workspace => set_code('TODO')}
        onChange={workspace => {
          try {
            const code = Generator_vim.workspaceToCode(workspace);
            set_code(code);
            set_error_obj(null);
          } catch(e) {
            if( // equality check to prevent infinite rerender loop
              error_obj === null ||
              e.constructor !== error_obj.constructor ||
              e.message !== error_obj.message
            )
              set_error_obj(e);
          }
        }}
      />
      <CodeToggle onClick={() => set_modal_open(true)}>
        <Download />
      </CodeToggle>
      <CodeOutput
        visible={modal_open}
        content={code}
        error={error_obj}
        onCancel={() => set_modal_open(false)}
      />
    </EditorWrapper>
  );
}

export default VimEditor;
