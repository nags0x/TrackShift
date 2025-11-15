import { LineChart } from '@mui/x-charts/LineChart';
import { XAxis, YAxis } from '@mui/x-charts/models';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';


import {
  dateAxisFormatter,
  percentageFormatter,
  usUnemploymentRate,
} from '../tempDataSet.ts'


const xAxis: XAxis<'time'>[] = [
  {
    dataKey: 'date',
    label: 'Frequency',
    labelStyle: {
      fill: '#ccc',      // label color
      fontSize: 14,
      margin:0
    },
    scaleType: 'time',
    valueFormatter: dateAxisFormatter,
  },
];
const yAxis: YAxis<'time'>[] = [
  {
    label: 'Amplitude',          // fixed spelling
    labelStyle: {
      fill: '#ccc',
      fontSize: 14,
      margin: 0,
    },
    valueFormatter: percentageFormatter,
  },
];
const series = [
  {
    dataKey: 'rate',
    showMark: false,
    valueFormatter: percentageFormatter,
    color: '#FF0000'
  },
];
export default function GridDemo() {
  return (
<div className="flex-col relative bg-racing-panel/50 rounded-2xl border border-racing-border/50 backdrop-blur-sm flex justify-center items-center pr-10 py-5">
<span className='font-mono font-bold'>Engine Vibration</span>

  <div className="w-full max-w-[800px]"> 
    <LineChart
      dataset={usUnemploymentRate}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      height={300}
      width={undefined}
      grid={{ vertical: true, horizontal: true }}
      sx={{
        [`& .${chartsGridClasses.line}`]: {
          stroke: "#999",
          strokeDasharray: "5 3",
          strokeWidth: 2,
        },
      }}
    />
  </div>
</div>

  );
}
