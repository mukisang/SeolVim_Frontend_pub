import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { Link } from 'react-router-dom';

const Aligner = styled.div`
    margin-top: 1rem;
    text-align: right;
    display : flex;
    justify-content : space-between;
`;

const StyledLink = styled(Link)`
    color: ${oc.gray[6]};
    &:hover {
        color: ${oc.gray[7]};
    }
`

const RightAlignedLink = ({to1, to2, children}) => (
    <Aligner>
        <StyledLink to={to1}>To Home</StyledLink>
        <StyledLink to={to2}>{children}</StyledLink>
    </Aligner>
);

export default RightAlignedLink;