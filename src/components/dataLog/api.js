
const accessToken = '933e59ddf1ee1eff00e466ca8c5e5ef7df1b1b46'; // expires 8/28/20
const deviceId = '2b0047000947343337373738';
const temperatureVariable = 'temp_F';

export const getTemp = async () => {
  const baseUrl = 'https://api.particle.io';
  const url = `${baseUrl}/v1/devices/${deviceId}/${temperatureVariable}?access_token=${accessToken}`;
  const response = await fetch(url);
  const json = response.json();
  console.log(json);
  return json;
};
