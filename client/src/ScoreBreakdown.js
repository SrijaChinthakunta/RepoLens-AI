import ScoreDonut from "./ScoreDonut";

const labels = ["Projects","Descriptions","Documentation","Code","Consistency","Community"];
const colors = ["#8A2BE2","#E491C9","#C77DFF","#F72585","#560BAD","#B8B8FF"];

function ScoreBreakdown({ breakdown }) {
  const total = breakdown.reduce((a,b) => a+b,0);

  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        {breakdown.map((value, i) => {
          const percent = total ? Math.round((value/100)*100) : 0;
          return (
            <div key={i} style={styles.row}>
              <span style={{...styles.colorBox, backgroundColor: colors[i]}}></span>
              <span style={styles.label}>{labels[i]}</span>
              <span style={styles.percent}>{percent}%</span>
            </div>
          );
        })}
      </div>

      <div style={styles.right}>
        <ScoreDonut breakdown={breakdown} />
      </div>
    </div>
  );
}

const styles = {
  wrapper:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"20px"},
  left:{flex:1},
  right:{width:"180px",height:"180px"},
  row:{display:"flex",alignItems:"center",marginBottom:"10px"},
  colorBox:{width:"12px",height:"12px",borderRadius:"3px",marginRight:"10px"},
  label:{flex:1,fontSize:"14px"},
  percent:{fontWeight:"bold"}
};

export default ScoreBreakdown;
