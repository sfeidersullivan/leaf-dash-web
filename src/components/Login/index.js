import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { login, getDevices } from '../../api';
import { sessionStorageKeys } from '../../constants';

const Login = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleModalOpen = () => setModalIsOpen(true);
  const handleModalClose = () => {
    setModalIsOpen(false);
    resetFields();
    setErrors([]);
  };

  const [username, setUsername] = useState('');
  const handleUsernameChange = event => setUsername(event.target.value);
  const [password, setPassword] = useState('');
  const handlePasswordChange = event => setPassword(event.target.value);
  const [devices, setDevices] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const resetFields = () => {
    setUsername('');
    setPassword('');
  };

  const handleLogin = async (event) => {
    if(event) event.preventDefault();
    setLoading(true);
    setErrors([]);
    const { error: loginError } = await login({ username, password });
    if (loginError) setErrors(errs => [...errs, loginError]);
    const { results, error: getDevicesError } = await getDevices();
    if (getDevicesError) setErrors(errs => [...errs, getDevicesError]);
    setDevices(results || []);
    // alwasy select first, this is fragile, but dropdown is not controlled
    if ((results || []).length > 0) handleSelectDevice({ target: { value: results[0].id }});
    setPassword('');
    setLoading(false);
  };

  const handleSelectDevice = ({ target: { value } }) => {
    console.log(value)
    sessionStorage.setItem(sessionStorageKeys.deviceId, value);
  };

  return (
    <>
      <h4>
        <button
          style={{
            height: '2rem',
            border: '2px solid gray',
            borderRadius: 5,
            background: 'none',
            color: 'white',
            textAlign: 'center',
          }}
          onClick={handleModalOpen}
        >
          Login
        </button>
      </h4>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        style={{
          content: {}
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <form onSubmit={event => event.preventDefault()} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ margin: 5 }}>
              <label>
                u: <input value={username} type='text' onChange={handleUsernameChange}></input>
              </label>
            </div>
            <div style={{ margin: 5 }}>
              <label>
                p: <input value={password} type='password' onChange={handlePasswordChange}></input>
              </label>
            </div>
            <div style={{ margin: 5 }}>
                <button onClick={handleLogin} style={{ width: '100%', textAlign: 'right' }}>--></button>
            </div>
          </form>
          <label>
            d: <select name='devices' onChange={handleSelectDevice}>
                {devices.map(({ name, id }) => <option value={id}>{name}</option>)}
              </select>
          </label>
          {loading && <text>loading...</text>}
          {errors && <ul>{errors.map(err => (<li>{err}</li>))}</ul>}
        </div>
      </ReactModal>
    </>
  );
};

export default Login;
