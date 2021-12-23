import axios from 'axios';


export const backsignup = ({email, password}) => axios.post('/api/signup', { email, password });
export const backsignin = ({email, password}) => axios.post('/api/signin', { email, password });
export const checkStatus = () => axios.get('/api/check')
export const signOut = () => axios.get('/api/signout');