import Particle from 'particle-api-js';
import { sessionStorageKeys } from '../constants';

// ** replace with your values **
const particleVariableMap = {
  'temperature': 'temp_F',
  'humidity': 'humidity',
  'lightsOn': 'lights_On',
};

const particleBaseUrl = 'https://api.particle.io';

const particle = new Particle();

const getDeviceId = () => sessionStorage.getItem(sessionStorageKeys.deviceId);
const getAccessToken = () => sessionStorage.getItem(sessionStorageKeys.accessToken);

export const getParticleVariable = async (variable) => {
  try {
    const particleVariable = particleVariableMap[variable];
    if (!particleVariable) return { result: undefined, error: 'invalid variable name' };
    const accessToken = getAccessToken();
    if (!accessToken) return { result: undefined, error: 'missing access token' };
    const deviceId = getDeviceId();
    if (!deviceId) return { result: undefined, error: 'missing deviceId' };
    
    const url = `${particleBaseUrl}/v1/devices/${deviceId}/${particleVariable}?access_token=${accessToken}`;
    const response = await fetch(url);
    const json = response.json();
    return json;
  } catch({ message }) {
    return ({ error: message })
  }
};

export const login = async ({ username, password }) => {
  try {
    const data = await particle.login({username, password});
    const token = data.body.access_token;
    
    // save to sessionStorage
    sessionStorage.setItem(sessionStorageKeys.accessToken, token);
    return ({ result: token });
  } catch({ message }) {
    sessionStorage.removeItem(sessionStorageKeys.accessToken);
    console.log('error loging in', message);
    return ({ error: message });
  }
};

export const getDevices = async () => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) return ({ error: 'no access token' });
    const { body: devices } = await particle.listDevices({ auth: accessToken });
    console.log(devices)
    return ({ results: devices });
  } catch({ message }) {
    return ({ error: message });
  }
}
