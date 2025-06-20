import React from "react";
import GaugeChart from "react-gauge-chart";

const MemoGauge = React.memo(
  ({ id, percent, colors }) => {
    return (
      <GaugeChart
        id={id}
        nrOfLevels={3}
        percent={percent}
        colors={colors}
        arcWidth={0.3}
        textColor="#000"
        animate
        formatTextValue={() => ""}
      />
    );
  },
  (prevProps, nextProps) => prevProps.percent === nextProps.percent
);

export default MemoGauge;
