import './login.css';
import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from './AuthProvider';
import frame from '../img/frame1.png';
import axios from './axios';

const LOGIN_URL='api/v1/auth';

const Login =() => {
  const {setAuth} = useContext(AuthContext)
  const userRef = useRef();
  const errRef = useRef();

  const [CardNumber, setCard] = useState('');
  const [Pin, setPin] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [sucess, setSucess] = useState('');

  useEffect(() =>{
    userRef.current.focus();
  },[])

  useEffect(()=>{
    setErrMsg('');
  }, [CardNumber, Pin])

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      const response = await axios.post(LOGIN_URL, JSON.stringify({CardNumber, Pin}),{headers: {'Content-Type':'application/json'}})
      console.log(response?.data)
      const accessToken = response?.data?.Token;
      setAuth({CardNumber, Pin, accessToken});
      setCard('');
      setPin('');
      setSucess(true);
    }
    catch(err){
      if(!err.response){
        setErrMsg('No server response');
      } else if (err.response?.status === 400){
        setErrMsg('Missing Card number or Password');
      } else if(err.response?.status === 401){
        setErrMsg('Unatorized');
      } else if(err.response?.status === 502){
          setErrMsg('Bad Gateway');
      } else{
        setErrMsg('Login Failed');
    }
    errRef.current.focus();
  }
  }

  return (
    <>
    {sucess?(
    <section>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <h1>Te has logeado</h1>
      <p><a href="#">HomeBanking</a></p>
    </section>):
    (
    <div className="general">
      <div className="img">
        <img src={frame}/>
      </div>
    <div className="cardlogin">
      <div className="list-container">
        <ul className="lists">
          <li><a href="#" className="tipo-ingr">Personal</a></li>
          <li><a href="#" className="tipo-ingr">Empresarial</a></li>
        </ul>
      </div>
      <div className="formulario" onSubmit={handleSubmit}>
      <form>
          <div><label>Numero de tarjeta</label></div>
          <input type="text" id="CardNumber" ref={userRef} autoComplete="off" onChange={(e) => setCard(e.target.value)} value={CardNumber} />
          <div><label>Password</label></div>
          <input type="password" id="Pin" onChange={(e) => setPin(e.target.value)} value={Pin} />
          <div className="recuperar"><a href="#">¿Olvidaste tu contraseña?</a></div>
          <button className="btn-acceder">Acceder</button>
      </form>
    </div>
    </div>
    </div>
    )}
    </>
  );
}


export default Login;
