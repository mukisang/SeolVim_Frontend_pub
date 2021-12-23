import React from 'react'
import styled from 'styled-components';
import oc from 'open-color';
import { shadow, media } from '../../lib/style_utils';
import SeolVimImg from '../../img/SeolVim_logo.png'

// 상단 고정, 그림자
const Positioner = styled.div`

    position: static;
    top: 0px;
    width: 100%;
    ${shadow(1)}
`;

const WhiteBackground = styled.div`
    background: white;
    display: flex;
    justify-content: center;
    height: auto;
`;

// 해더의 내용
const HeaderContents = styled.div`

    width: 1200px;
    height: 55px;
    display: flex;
    flex-direction: row;
    align-items: center;

    padding-right: 1rem;
    padding-left: 1rem;
    ${media.wide`
        width: 992px;
    `}

    ${media.tablet`
        width: 100%;
    `}
`;

// 로고
const Logo = styled.div`
    margin-left : 0.3em;
    font-size: 1.4rem;
    letter-spacing: 2px;
    color: ${oc.gray[8]};
    font-family: 'Rajdhani';
`;

// middle 여백
const Spacer = styled.div`
    flex-grow: 1;
`;

// 하단 그래디언트 테두리
const GradientBorder = styled.div`
    height: 3px;
    background: linear-gradient(to right, ${oc.gray[8]}, ${oc.gray[7]});
`;

const Navi = ({children}) => {
    return (
        <Positioner>
            <WhiteBackground>
                <HeaderContents>
                    <img src = {SeolVimImg} alt = "noIMG"
                    display = "block" width ="4%" height = "auto"
                    margin-top = "0.1em"
                    />
                    <Logo>SeolVim</Logo>
                    <Spacer/>
                    {children}
                </HeaderContents>
            </WhiteBackground>
            <GradientBorder/>
        </Positioner>
    );
};

export default Navi








//-------------------------------------------------------
// class Navi extends Component {
//   render() {
//     return (
//       <div>
//         <ul>
//           <li>
//             <Link to={'/'}>홈</Link>
//           </li>
//           <li>
//             <Link to={'/signin'}>로그인</Link>
//           </li>
//         </ul>
//       </div>
//     )
//   }
// }

// export default Navi