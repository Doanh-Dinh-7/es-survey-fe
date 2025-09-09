import { Bar } from "react-chartjs-2";
import { useRef, useEffect, useCallback } from "react";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

const COLORS = [
  "#3182CE",
  "#34A853",
  "#FBBC05",
  "#EA4335",
  "#A259FF",
  "#FF6F00",
  "#00B8D9",
  "#FF4081",
  "#7C4DFF",
  "#00C853",
];

const BarChartToCanvas = ({
  data,
  labels,
  percents,
  onImage,
}: {
  data: number[];
  labels: string[];
  percents: number[];
  onImage: (img: string) => void;
}) => {
  const ref = useRef<any>(null);
  const lastBase64 = useRef<string | null>(null);

  const handleImage = useCallback(
    (img: string) => {
      if (img && img !== lastBase64.current) {
        lastBase64.current = img;
        onImage(img);
      }
    },
    [onImage]
  );

  useEffect(() => {
    if (ref.current) {
      const base64 = ref.current.toBase64Image();
      handleImage(base64);
    }
  }, [data, labels, percents, handleImage]);

  return (
    <Bar
      ref={ref}
      data={{
        labels,
        datasets: [
          {
            data: percents,
            backgroundColor: COLORS,
          },
        ],
      }}
      options={{
        responsive: false,
        animation: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: "end",
            align: "end",
            color: "#222",
            font: { weight: "bold" },
            formatter: (value: any, ctx: any) => percents[ctx.dataIndex] + "%",
          },
        },
        scales: {
          y: { beginAtZero: true, max: 100 },
        },
      }}
      width={400}
      height={200}
      plugins={[ChartDataLabels]}
    />
  );
};

export default BarChartToCanvas;
