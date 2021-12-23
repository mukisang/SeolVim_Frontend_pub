import { useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const
  ModalBackdrop = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 60%);
  `,
  ModalWindow = styled.div`
    position: fixed;
    left: 10%;
    top: 50%;
    padding: 1rem;
    width: 80%;
    max-height: 80%;
    background: white;
    overflow-y: auto;
    box-sizing: border-box;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 80%);
    transform: translate(0, -50%);
  `,
  CodeView = styled.div`
    width: 100%;
    background-color: black;
  `,
  CodeArea = styled.textarea`
    margin: 2em;
    border: none;
    padding: 0;
    width: calc(100% - 4em);
    height: 10em;
    color: white;
    background-color: inherit;
    font-family: monospace;
    resize: none;
  `,
  ErrorLine = styled.p`
    color: red;
  `;

function CodeOutput({
  visible = true,
  content, error = null,
  onCancel = () => {}
}) {
  const codeArea = useRef(null);
  useLayoutEffect(() => {
    const { current: elem } = codeArea;
    if(elem !== null) {
      elem.style.height = `${elem.scrollHeight}px`;
      codeArea.current = null;
    }
  });

  return !visible
    ? null
    : ReactDOM.createPortal(
      <ModalBackdrop onClick={(e) => {
        if(e.target === e.currentTarget)
          onCancel(e);
      }}>
        <ModalWindow>
          <h2>코드 내보내기</h2>
          <p>
            아래 텍스트 상자에 출력된 코드를 복사하거나 <a href={`data:application/octet-stream,${encodeURIComponent(content)}`} download="sample.vim">여기를 눌러 파일로 다운로드</a>해 주세요.
          </p>
          {error !== null
            && <ErrorLine>코드 생성 중 알 수 없는 오류가 발생했습니다: {error.message}</ErrorLine>
          }
          <CodeView>
            <CodeArea ref={codeArea} value={content} readOnly={true} />
          </CodeView>
        </ModalWindow>
      </ModalBackdrop>,
      document.getElementById('modal')
    );
}

export default CodeOutput;
