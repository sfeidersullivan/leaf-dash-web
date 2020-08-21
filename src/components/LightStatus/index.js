import React, { useState, useEffect } from 'react';

import { getParticleVariable } from '../../api';

const LightStatus = () => {
  const [lightsOn, setLightsOn] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { result } = await getParticleVariable('lightsOn');
      setLightsOn(!!result);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fontColor = lightsOn ? 'white' : 'gray';

  return (
    <h2 style={{ color: fontColor }} >
      Lights: { lightsOn ? 'ON' : 'OFF' }
    </h2>
  )
};

export default LightStatus;