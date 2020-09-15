import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import moment from 'moment';

import { getParticleVariable } from '../../api';

const dataLength = 50000000; // [milliseconds]
const pollSpeed = 10000;

const DataLog = (props) => {
  const { defaultData, variable, title, yMin, yMax } = props;
  const options = {
    chart: {
      id: 'realtime',
      type: 'area',
      animations: {
        enabled: false,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000,
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      colors: ['#646464'],
    },
    title: {
      text: title,
      align: 'left'
    },
    markers: {
      size: 0,
      strokeColors: '#646464',
    },
    xaxis: {
      type: 'datetime',
      range: dataLength,
      labels: {
        show: true,
        // format: 'h:mm:ss',
        formatter: (value, timestamp, index) => moment.utc(timestamp).local().format('ddd h:mm a'),
      },
    },
    yaxis: {
      max: yMax,
      min: yMin,
    },
    legend: {
      show: false
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
  };

  const [data, setData] = useState(defaultData);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { result } = await getParticleVariable(variable);
      const temp = typeof result === 'number' ? +result.toFixed(1) : null;
      setData(prevData => {
        const [first, ...rest] = prevData;
        const nowTicks = Date.now();
        const next = { x: nowTicks, y: temp };
        const firstOutOfRange = first && first.x < (nowTicks - dataLength);
        const newData = [...(firstOutOfRange ? rest : prevData), next];
        // ApexCharts.exec('realtime', 'updateSeries', [{ data }]);
        return newData;
      });
    }, pollSpeed);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Chart
        options={options}
        series={[{ data }]}
        width={900}
        height={300}
      />
    </div>
  );
};

DataLog.propTypes = {
  // required
  variable: PropTypes.oneOf(['temperature', 'humidity']).isRequired,
  yMin: PropTypes.number.isRequired,
  yMax: PropTypes.number.isRequired,
  // optional
  title: PropTypes.string,
  defaultData: PropTypes.array,
};

DataLog.defaultProps = {
  title: undefined,
  defaultData: [], //[...Array(dataLength).keys()].map(i => ({ x: i, y: 0 }));
};

export default DataLog;
