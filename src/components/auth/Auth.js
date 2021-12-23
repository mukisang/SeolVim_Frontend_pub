import React, { Component } from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as baseActions from '../../redux/base';
import  Wrapper  from './Wrapper';
import { Route } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';



class Auth extends Component {
    // 페이지에 진입 할 때 헤더를 비활성화
    componentDidMount() {
        this.props.BaseActions.setHeaderVisibility(false);
    }

    // 페이지에서 벗어 날 때 다시 활성화
    componentWillUnmount() {
        this.props.BaseActions.setHeaderVisibility(true);
    }

    render() {
        return (
            <>
                <Wrapper>
                    <Route path="/auth/signin" component={SignIn}/>
                    <Route path="/auth/signup" component={SignUp}/>
                </Wrapper>
            </>
        );
    }
}

export default connect(
    (state) => ({}),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch)
    })
)(Auth);
