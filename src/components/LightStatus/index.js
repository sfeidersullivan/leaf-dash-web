import React, { useState, useEffect } from 'react';

import { getParticleVariable } from '../../api';

const LightStatus = () => {
  const [lightsOn, setLightsOn] = useState(undefined);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { result } = await getParticleVariable('lightsOn');
      setLightsOn(result);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const statusLabel = lightsOn === true ? 'ON' : lightsOn === false ? 'OFF' : 'NA';
  const fontColor = lightsOn === true ? 'white' : 'gray';

  return (
    <h2 style={{ color: fontColor }} >
      Lights: {statusLabel}
    </h2>
  )
};

export default LightStatus;