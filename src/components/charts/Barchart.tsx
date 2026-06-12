import React from "react";
import { theme } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BarChartDataPoint {
  label: string;
  aprobado: number;
  modificado: number;
  pagado: number;
  devengado?: number;
}

interface BarchartProps {
  data: BarChartDataPoint[];
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  const { token } = theme.useToken();

  if (!active || !payload) return null;

  const formatValue = (value: number) =>
    `$${Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} mdp`;

  return (
    <div
      style={{
        background: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: 8,
        padding: "8px 10px",
        boxShadow: token.boxShadowSecondary,
        fontSize: 12,
        color: token.colorText,
      }}
    >
      <strong style={{ display: "block", marginBottom: 4 }}>{label}</strong>
      {payload.map((entry: any) => (
        <div
          key={entry.dataKey}
          style={{ whiteSpace: "nowrap", color: entry.color || token.colorText, marginTop: 2 }}
        >
          {`${entry.name}: ${formatValue(Number(entry.value))}`}
        </div>
      ))}
    </div>
  );
};

export const BarchartComponent: React.FC<BarchartProps> = ({ data, title }) => {
  const formatYAxis = (value: number) => `${value.toLocaleString("en-US")}`;

  return (
    <div style={{ width: "100%", height: 360, marginTop: 10 }}>
      {title ? <p style={{ marginBottom: 8, fontWeight: 600 }}>{title}</p> : null}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 18, left: 8, bottom: 18 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickFormatter={formatYAxis} width={60} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={32} />
          <Bar dataKey="aprobado" name="Aprobado" fill="#1677ff" radius={[4, 4, 0, 0]} />
          <Bar dataKey="modificado" name="Modificado" fill="#52c41a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pagado" name="Pagado" fill="#f5222d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
