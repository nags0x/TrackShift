import { LineChart } from '@mui/x-charts/LineChart';
import { XAxis, YAxis } from '@mui/x-charts/models';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { useUserData } from '@/store/userData.store';
import { useState, useEffect } from 'react';

interface GridDemo {
  SampleIndex: number;   // <-- streaming axis
  Frequency: number;     // your original var
  Amplitude: number;     // your original var
}

const xAxis = [
  {
    dataKey: "SampleIndex",
    label: "Samples",
    scaleType: "linear",
    labelStyle: { fill: "#ccc", fontSize: 14 },
  },
];

const yAxis = [
  {
    dataKey: "Amplitude",
    label: "Amplitude",
    valueFormatter: (v) => v.toFixed(2),
    labelStyle: { fill: "#ccc", fontSize: 14 },
  },
];

export default function GridDemo() {
  const frequency = useUserData((s) => s.Data.Frequency);
  const amplitude = useUserData((s) => s.Data.Amplitude);

  const [sampleIndex, setSampleIndex] = useState(0);
  const [vibrationData, setVibrationData] = useState<GridDemo[]>([]);

  useEffect(() => {
    if (frequency === undefined || amplitude === undefined) return;

    setSampleIndex((i) => i + 1);

    setVibrationData((prev) => {
      const updated = [
        ...prev,
        {
          SampleIndex: sampleIndex, // keeps graph moving smoothly
          Frequency: frequency,     // still stored!
          Amplitude: amplitude,     // still stored!
        },
      ];
      return updated.slice(-200); // rolling 200 samples
    });
  }, [frequency, amplitude]);

  return (
    <LineChart
      dataset={vibrationData}
      xAxis={xAxis}
      yAxis={yAxis}
      series={[
        {
          dataKey: "Amplitude",
          showMark: false,
          color: "#FF0000",
        },
      ]}
      height={300}
      grid={{ vertical: true, horizontal: true }}
    />
  );
}
