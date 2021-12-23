import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { shadow } from '../../lib/style_utils';
import { Link } from 'react-router-dom';
import mainImg from '../../img/main.png'
import SeolVimImg from '../../img/SeolVim_logo.png'

// 화면의 중앙에 위치시킨다
const Positioner = styled.div`
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    display : flex;
    flex-direction : column;
    flex-wrap :wrap;
    align-items : center;
    justify-content : center;
    background : grey;
`;

// 너비, 그림자 설정
const ShadowedBox = styled.div`
    display : flex;
    flex-direction : column;
    flex-wrap : wrap;
    align-items : center;
    justify-content : center;
    // margin-right : 0.5em;
    overflow : hidden;
    // ${shadow(2)}
`;



const Logo = styled(Link)`
    color: white;
    font-family: 'Rajdhani';
    font-size: 2.4rem;
    letter-spacing: 5px;
    text-decoration: none;
`;


// 로고
const LogoWrapper = styled.div`
    background: ${oc.gray[7]};
    width : 100%;
    display: flex;
    padding: 1rem;
    align-items: center;
    justify-content: center;
`;

// children 이 들어가는 곳
const Contents = styled.div`
    width : 100%;
    float : right;
    background: white;
    padding: 1rem;
    height: auto;
    align-items: center;
`;


const TextBody = styled.div`
    font-size : 20px;
    background : white;
    hight : auto;
    display : flex;
    flex-direction : column;
    flex-wrap : wrap;
    align-items : center;
    justify-content : center;
`;
const GreyBlockT = styled.div`
    background: ${oc.gray[7]};;
    display : flex;
    align-items : center;
    padding-bottom : 1px;
    height : 15em;
    justify-content : center;
    width : 100%;
    z-index : 2;
`;
const GreyBlockB = styled.div`
    background: ${oc.gray[7]};
    padding-top: 3px;
    display : flex;
    align-items : center;
    height : 15em;
    display : flex;
    width : 100%;

`;

const Body = styled.div`
    overflow : hidden;
    background : blue;
    width : 100%;
    height : auto;
    background : white;
    z-index : 1;
    display : flex;
    flex-direction : row;
    flex-wrap : wrap;
    align-items : center;
    justify-content : center;
`;

const Test = styled.div`
    font-size : 180px;
    // background : red;
    padding-right : 0.2em;
    display : flex;
`;

const Wrapper = ({children}) => (
    <>
        <Positioner> 
            <GreyBlockT>
                <img src = {SeolVimImg} alt = "noIMG"
                display = "block" width ="5%" height = "auto"
                margin-top = "0.1em"
                />
            </GreyBlockT>
            <Body>
                <Test>
                    <ShadowedBox>
                        <img src = {mainImg} alt = "noIMG"
                        width ="100%" height = "100%"
                        object-fit = "cover"
                        />
                    </ShadowedBox>
                </Test>
                
                <TextBody>
                    <ShadowedBox>
                        {children}
                    </ShadowedBox>
                </TextBody>
            </Body>
            <GreyBlockB />

            
        </Positioner>
    </>
);

export default Wrapper;