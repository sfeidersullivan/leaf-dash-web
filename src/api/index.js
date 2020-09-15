import Particle from 'particle-api-js';

// const accessToken = '933e59ddf1ee1eff00e466ca8c5e5ef7df1b1b46'; // expires 8/28/20
const deviceId = '2b0047000947343337373738';
const particleBaseUrl = 'https://api.particle.io';
const particleAccessTokenSessionStoageKey = 'leaf-dash-particle-access-token';

const particle = new Particle();

const particleVariableMap = {
  'temperature': 'temp_F',
  'humidity': 'humidity',
  'lightsOn': 'lights_On',
};

const getAccessToken = () => sessionStorage.getItem(particleAccessTokenSessionStoageKey);
export const hasAccessToken = !!getAccessToken();

export const getParticleVariable = async (variable) => {
  const particleVariable = particleVariableMap[variable];
  if (!particleVariable) {
    console.log('invalid variable name');
    return { result: undefined, error: 'invalid variable name' };
  };

  const accessToken = getAccessToken();
  if (!accessToken) {
    console.log('missing access token');
    return { result: undefined, error: 'missing access token' };
  };

  const url = `${particleBaseUrl}/v1/devices/${deviceId}/${particleVariable}?access_token=${accessToken}`;
  const response = await fetch(url);
  const json = response.json();
  return json;
};

export const login = async ({ username, password }) => {
  try {
    const data = await particle.login({username, password});
    const token = data.body.access_token;
    
    // save to sessionStorage
    sessionStorage.setItem(particleAccessTokenSessionStoageKey, token);
    return ({ result: token });
  } catch({ message }) {
    sessionStorage.removeItem(particleAccessTokenSessionStoageKey);
    console.log('error loging in', message);
    return ({ error: message });
  }
};
