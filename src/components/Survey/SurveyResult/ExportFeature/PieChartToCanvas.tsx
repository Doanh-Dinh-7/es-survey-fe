import { Pie } from "react-chartjs-2";
import { useRef, useEffect, useCallback } from "react";
import { Chart, ArcElement, CategoryScale, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Đăng ký các element cần thiết cho Pie chart và plugin datalabels
Chart.register(ArcElement, CategoryScale, Tooltip, Legend, ChartDataLabels);

const COLORS = [
  "#3182CE", "#34A853", "#FBBC05", "#EA4335", "#A259FF",
  "#FF6F00", "#00B8D9", "#FF4081", "#7C4DFF", "#00C853"
];

const PieChartToCanvas = ({ data, labels, percents, onImage }: { data: number[]; labels: string[]; percents: number[]; onImage: (img: string) => void }) => {
  const ref = useRef<any>(null);
  const lastBase64 = useRef<string | null>(null);

  const handleImage = useCallback((img: string) => {
    if (img && img !== lastBase64.current) {
      lastBase64.current = img;
      onImage(img);
    }
  }, [onImage]);

  useEffect(() => {
    if (ref.current) {
      const base64 = ref.current.toBase64Image();
      handleImage(base64);
    }
  }, [data, labels, percents, handleImage]);

  return (
    <Pie
      ref={ref}
      data={{
        labels,
        datasets: [
          {
            data: data,
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
            color: '#fff',
            formatter: (value: any, ctx: any) => percents[ctx.dataIndex] + '%'
          }
        }
      }}
      width={200}
      height={200}
      plugins={[ChartDataLabels]}
    />
  );
};

export default PieChartToCanvas; 