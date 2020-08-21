
const accessToken = '933e59ddf1ee1eff00e466ca8c5e5ef7df1b1b46'; // expires 8/28/20
const deviceId = '2b0047000947343337373738';
const baseUrl = 'https://api.particle.io';

const particleVariableMap = {
  'temperature': 'temp_F',
  'humidity': 'humidity',
  'lightsOn': 'lights_On',
};

export const getParticleVariable = async (variable) => {
  const particleVariable = particleVariableMap[variable];
  if (!particleVariable) return { result: undefined, error: 'invalid variable name' };
  const url = `${baseUrl}/v1/devices/${deviceId}/${particleVariable}?access_token=${accessToken}`;
  const response = await fetch(url);
  const json = response.json();
  return json;
};
