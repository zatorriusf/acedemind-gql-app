import React,{useState,useRef,useContext} from 'react';
import './auth.css';
import AuthContext from '../context/auth-context';

export default function Auth() {
    const [isLogin,setIsLogin] = useState(true);
    const emailEl = useRef('');
    const passwordEl = useRef('');
    const context = useContext(AuthContext);

    const handleSubmit = (evt) =>{
        const email = emailEl.current.value.trim();
        const password = passwordEl.current.value.trim()
        evt.preventDefault();
        if(email.length >0 && password.length >0){
            console.log(email, password);
            const requestBodyNewUser = {
                query :`
                    mutation {
                        createUser(userInput: {
                            email : "${email}",
                            password : "${password}"
                        }){
                            _id
                            email
                        }
                    }
                `
            }
            const requestBodyLogin = {
                query:`
                    query{
                        login(email: "${email}", password : "${password}"){
                            userId
                            token
                            tokenExpiration
                        }
                    }
                `
            }
            fetch('http://localhost:4000/graphql',{
                method: 'POST',
                body: JSON.stringify(isLogin ? requestBodyLogin: requestBodyNewUser),
                headers: {
                    'Content-Type' : 'application/json'
                }
            }).then(
                res => {
                    if(res.status !== 200 && res.status !==201){
                        console.log(res);
                    }
                    return res.json();
                }
            ).then(data => {
                console.log(data);
                if(data.data.login.token){
                    const token = data.data.login.token;
                    const userId = data.data.login.userId;
                    const tokenExpiration = data.data.login.tokenExpiration;

                    context.dispatch({
                        type: "LOGIN",
                        payload: data.data.login
                    });
                }
            })
             .catch(err => {throw err;})
        }
    }

    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Sign up' }</h2>
            <form className='auth-form' onSubmit={handleSubmit}>
                <div className='form-control'>
                    <label htmlFor='email'>Email</label>
                    <input ref ={emailEl} type='email' id='email' />
                </div>
                <div className='form-control'>
                    <label htmlFor='password'>password</label>
                    <input ref ={passwordEl} type='password' id='password' />
                </div>
                <div className='form-actions'>
                    <button type='submit'>submit</button>
    <button type='button' onClick={() => {setIsLogin(!isLogin);console.log(isLogin);}}>{isLogin ? 'Login' : 'Sign up' }</button>
                </div>
            </form>
        </div>
    )
}
