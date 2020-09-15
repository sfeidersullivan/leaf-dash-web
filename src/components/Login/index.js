import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { login } from '../../api';

const Login = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleModalOpen = () => setModalIsOpen(true);
  const handleModalClose = () => {
    setModalIsOpen(false);
    resetFields();
    setError(undefined);
  };

  const [username, setUsername] = useState('');
  const handleUsernameChange = event => setUsername(event.target.value);
  const [password, setPassword] = useState('');
  const handlePasswordChange = event => setPassword(event.target.value);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const resetFields = () => {
    setUsername('');
    setPassword('');
  };

  const handleLogin = async (event) => {
    if(event) event.preventDefault();
    setLoading(true);
    setError(undefined);
    const { error } = await login({ username, password });
    setLoading(false);
    if (error) {
      setError(error);
      return;
    };
    // success
    handleModalClose();
  };

  return (
    <>
      <h4><button
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
      </button></h4>
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
          {loading && <text>loading...</text>}
          {error && <text>{error}</text>}
        </div>
      </ReactModal>
    </>
  );
};

export default Login;
