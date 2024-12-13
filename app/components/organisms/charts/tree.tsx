import { light } from "@mui/material/styles/createPalette";
import React, { PureComponent } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#8889DD", "#9597E4", "#8DC77B", "#A5D297", "#E2CF45", "#F8C12D"];

interface TreeData {
  name: string;
  size?: number;
  percentage?: number;
}

interface TreeChartProps {
  data: TreeData[];
}

class CustomizedContent extends PureComponent<any> {
  render() {
    const { root, depth, x, y, width, height, index, payload, colors, rank, name, percentage }: any = this.props;

    return (
      <g onClick={() => console.log(root.children[index])}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : "#ffffff00",
            stroke: "#fff",
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {depth === 1 ? (
          <>
            <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" style={{ textTransform: "uppercase", fontWeight: "lighter" }} fontSize={10}>
              {name}
            </text>
            {/* <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fill="#fff" style={{ textTransform: "uppercase", fontWeight: "lighter" }} fontSize={10}>
              {percentage.toFixed(1)}%
            </text> */}
          </>
        ) : null}
        {depth === 1 ? (
          <text x={x + 4} y={y + 18} fill="#fff" fontSize={11} fillOpacity={0.9}>
            {index + 1}
          </text>
        ) : null}
      </g>
    );
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "white", padding: 10, borderRadius: 3, boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)" }} className="treemap-custom-tooltip">
        <p style={{ textTransform: "uppercase", fontSize: 11 }}>{`${payload[0].payload.name}`}</p>
        <p style={{ textTransform: "uppercase", fontSize: 12 }}>{`Total sales : $ ${Intl.NumberFormat().format(payload[0].value)}`}</p>
        {/* {payload[0].payload?.percentage ? <p style={{ textTransform: "uppercase", fontSize: 12 }}>{`Representation: ${payload[0].payload.percentage.toFixed(2)}%`}</p> : ""} */}
      </div>
    );
  }

  return null;
};

export const TreeChart = (props: TreeChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap content={<CustomizedContent colors={COLORS} />} isAnimationActive={false} data={props.data} dataKey="size" aspectRatio={4 / 3} stroke="#fff" fill="#3b82f6">
        <Tooltip content={<CustomTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  );
};
