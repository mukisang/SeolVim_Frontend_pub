import React, { Component } from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import AuthContent from './AuthContent';
import InputLabel from './InputLabel';
import AuthButton from './AuthButton';
import RightAlignedLink from './RightAlignedLink';
import AuthError from './AuthError';
import * as authActions from '../../redux/auth';
import {isEmail, isLength} from 'validator';
import storage from '../../lib/storage'
import * as userActions from '../../redux/user'



class SignUp extends Component {

    componentWillUnmount() {
        const { AuthActions } = this.props;
        AuthActions.initializeForm('signup')
    }

    setError = (message) => {
        const { AuthActions } = this.props;
        AuthActions.setError({
            form: 'signup',
            message
        });
    }

    validate = {
        email: (value) => {
            if(!isEmail(value)) {
                this.setError('잘못된 이메일 형식 입니다.');
                return false;
            }
            return true;
        },
        password: (value) => {
            if(!isLength(value, { min: 2 })) {
                this.setError('비밀번호를 2자 이상 입력하세요.');
                return false;
            }
            this.setError(null); // 이메일과 아이디는 에러 null 처리를 중복확인 부분에서 하게 됩니다
            return true;
        },
        passwordConfirm: (value) => {
            if(this.props.form.get('password') !== value) {
                this.setError('비밀번호확인이 일치하지 않습니다.');
                return false;
            }
            this.setError(null); 
            return true;
        }
    }

    handleChange = (e) => {
        const { AuthActions } = this.props;
        const { name, value } = e.target;

        AuthActions.changeInput({
            name,
            value,
            form: 'signup'
        });
        
        // 검증작업 진행
        const validation = this.validate[name](value);
        if(name.indexOf('password') > -1 || !validation) return; // 비밀번호 검증이거나, 검증 실패하면 여기서 마침
        else {this.setError(false)}
    }

    handleBackSignUp = async () => {
        const { form, AuthActions, UserActions, error, history } = this.props;
        const { email, password, passwordConfirm } = form.toJS();

        const { validate } = this;

        if(error) return; // 현재 에러가 있는 상태라면 진행하지 않음
        if(!validate['email'](email)  
            || !validate['password'](password) 
            || !validate['passwordConfirm'](passwordConfirm)) { 
            // 하나라도 실패하면 진행하지 않음
            return;
        }

        try {
            await AuthActions.backsignup({
                email, password
            })
            const Email = this.props.result.toJS().body.email;
            

            storage.set('email', Email);
            UserActions.setEmail(Email);
            UserActions.setValidated(true);
            // TODO: 로그인 정보 저장 (로컬스토리지/스토어)
            history.push('/auth/signin'); // 회원가입 성공시 홈페이지로 이동
        } catch(e) {
            // 에러 처리하기
            // console.log("에러로 들어옴")
            // console.log(e)
            if(e.response.status === 409) {
                const message = "이미 존재하는 이메일 입니다."
                return this.setError(message);
            }
            this.setError('알 수 없는 에러가 발생했습니다.(백엔드 서버 오류?)')
        }
    } 

    render() {
        const { error } = this.props;
        const { email, password, passwordConfirm } = this.props.form.toJS();
        const { handleChange } = this;

        return (
            <AuthContent title="Sign Up">
                <InputLabel 
                    label="이메일"
                    name="email"
                    placeholder="이메일" 
                    value={email} 
                    onChange={handleChange}
                />
                <InputLabel 
                    label="비밀번호" 
                    name="password" 
                    placeholder="비밀번호"
                    type="password" 
                    value={password} 
                    onChange={handleChange}
                />
                <InputLabel 
                    label="비밀번호 확인" 
                    name="passwordConfirm" 
                    placeholder="비밀번호 확인" 
                    type="password" 
                    value={passwordConfirm}
                    onChange={handleChange}
                />
                {
                    error && <AuthError>{error}</AuthError>
                }
                <AuthButton onClick = {this.handleBackSignUp}>Sign Up</AuthButton>
                <RightAlignedLink to1 = "/" to2="/auth/signin">Sign In</RightAlignedLink>
            </AuthContent>
        );
    }
}


export default connect(
    (state) => ({
        form: state.auth.getIn(['signup', 'form']),
        error: state.auth.getIn(['signup', 'error']),
        result: state.auth.get('result')
    }),
    (dispatch) => ({
        AuthActions: bindActionCreators(authActions, dispatch),
        UserActions: bindActionCreators(userActions, dispatch)
    })
)(SignUp);
