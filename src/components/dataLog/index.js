import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import moment from 'moment';

import { getTemp } from './api';

const dataLength = 50000000; // [milliseconds]
const speed = 5000;
const defaultData = []; //[...Array(dataLength).keys()].map(i => ({ x: i, y: 0 }));
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
  // colors: ['#ffffff'],
  // theme: {
  //   mode: 'dark',
  // },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
  },
  title: {
    text: 'Temperature',
    align: 'left'
  },
  markers: {
    size: 0,
  },
  xaxis: {
    // type: 'numeric',
    type: 'datetime',
    range: dataLength,
    labels: {
      show: true,
      // format: 'h:mm:ss',
      formatter: (value, timestamp, index) => moment.utc(timestamp).local().format('h:mm:ss'),
    },
  },
  yaxis: {
    max: 85, // F
    min: 65,
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

const DataLog = () => {
  const [gtemps, setTemps] = useState(defaultData);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { result } = await getTemp();
      const temp = !isNaN(result) ? +result.toFixed(1) : null; // doesn't like undefined
      setTemps(temps => {
        const [first, ...rest] = temps;
        const nowTicks = Date.now();
        const next = { x: nowTicks, y: temp };
        const firstOutOfRange = first && first.x < (nowTicks - dataLength);
        const data = [...(firstOutOfRange ? rest : temps), next];
        // ApexCharts.exec('realtime', 'updateSeries', [{ data }]);
        return data;
      });
    }, speed);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Chart
        options={options}
        series={[{ data: gtemps }]}
        width={1000}
        height={400}
      />
    </div>
  );
};

export default DataLog;
