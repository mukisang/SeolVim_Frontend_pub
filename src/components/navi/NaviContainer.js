import React, { Component } from 'react';
import Navi from './Navi.js';
import {connect} from 'react-redux'
import * as userActions from '../../redux/user'
import storage from '../../lib/storage.js';
import { bindActionCreators } from 'redux';

//---design--------
import styled from 'styled-components';
import oc from 'open-color';
import { Link } from 'react-router-dom';
import { shadow } from '../../lib/style_utils';


const BorderedButton = styled(Link)`
    font-weight: 600;
    color: ${oc.gray[7]};
    border: 1px solid ${oc.gray[6]};
    padding: 0.5rem;
    padding-bottom: 0.4rem;
    cursor: pointer;
    border-radius: 2px;
    text-decoration: none;
    transition: .2s all;
    

    &:hover {
        background: ${oc.gray[8]};
        color: white;
        ${shadow(1)}
    }

    &:active {
        /* 마우스 클릭시 아래로 미세하게 움직임 */
        transform: translateY(3px);
    }


`;

class NaviContainer extends Component {

    handleSignOut = async() => {
        console.log("handleSignOut clicked")
        const {UserActions} = this.props
        try{
            await UserActions.signOut()
        } catch(e){
            console.log(e)
        }
        
        storage.remove('email')
        window.location.href = '/'
    }

    

    render() {
        const {visible, user} = this.props;
        if(!visible) return null;

        return (
            <Navi>
                {user.get('logged')
                    ?(<BorderedButton onClick = {this.handleSignOut}> {user.get('email')} - SignOut </BorderedButton>)
                    :<BorderedButton to="/auth/signin"> SignIn </BorderedButton>
                }
                
            </Navi>
        );
    }
}

export default connect(
    (state) => ({
        visible: state.base.getIn(['header', 'visible']),
        user : state.user
    }),
    (dispatch) => ({
        UserActions : bindActionCreators(userActions, dispatch)
    })
)(NaviContainer);