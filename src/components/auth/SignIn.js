import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../../redux/user'
import * as authActions from '../../redux/auth'
import storage from '../../lib/storage';
import queryString from 'query-string'



import AuthContent from './AuthContent';
import InputLabel from './InputLabel';
import AuthButton from './AuthButton';
import RightAlignedLink from './RightAlignedLink';
import AuthError from './AuthError';

class SignIn extends Component {

  handleChange = (e) => {
    const { AuthActions } = this.props;
    const { name, value } = e.target;

    AuthActions.changeInput({
        name,
        value,
        form: 'signin'
    });
  }

  componentWillUnmount() {
    const { AuthActions } = this.props;
    AuthActions.initializeForm('signin')
  }

  componentDidMount(){
    const { location } = this.props
    const query = queryString.parse(location.search)

    if(query.expired !== undefined)
      this.setError('세션이 만료 되었습니다.')
  }
  

  setError = (message) => {
    const { AuthActions } = this.props;
    AuthActions.setError({
        form: 'signin',
        message
    });
    return false;
  }

  handleBackLogin = async () => {
    
    const { form, AuthActions, UserActions, history } = this.props;
    const { email, password } = form.toJS();

    try {
        await AuthActions.backsignin({email, password});
        const Email = this.props.result.toJS().body.email;
        console.log(Email)
        UserActions.setEmail(Email);
        history.push('/');
        storage.set('email', Email);

    } catch (e) {
      console.log(e)
      const message = e.response.status === 403 ? '아이디 혹은 비밀번호가 맞지 않습니다.' : '백앤드 서버가 꺼져 있습니다.'
      this.setError(message);
    }
  }



  render() {
    const { email, password } = this.props.form.toJS(); // form 에서 email 과 password 값을 읽어옴
    const { handleChange , handleBackLogin} = this;
    const { error } = this.props;

    return (
      <>
        <AuthContent title="Sign In">
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
          {
            error && <AuthError>{error}</AuthError>
          }
          <AuthButton onClick={handleBackLogin}>Sign In</AuthButton>
          <RightAlignedLink to1 = "/" to2="/auth/signup">Sign Up</RightAlignedLink>
        </AuthContent>
      </>
  );
  }
}

export default connect(
  (state) => ({
      form: state.auth.getIn(['signin', 'form']),
      error: state.auth.getIn(['signin', 'error']),
      result: state.auth.get('result')
  }),
  (dispatch) => ({
      AuthActions: bindActionCreators(authActions, dispatch),
      UserActions: bindActionCreators(userActions, dispatch)
  })
)(SignIn);