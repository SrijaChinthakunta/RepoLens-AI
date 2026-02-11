import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

function ScoreDonut({ breakdown }) {
  const data = {
    labels: ["Projects","Descriptions","Documentation","Code","Consistency","Community"],
    datasets: [{
      data: breakdown,
      backgroundColor: [
        "#8A2BE2",
        "#E491C9",
        "#C77DFF",
        "#F72585",
        "#560BAD",
        "#B8B8FF"
      ],
      borderWidth: 0
    }]
  };

  const options = {
    cutout: "70%",
    plugins: { legend: { display: false } },
    maintainAspectRatio: false
  };

  return <Doughnut data={data} options={options} />;
}

export default ScoreDonut;
