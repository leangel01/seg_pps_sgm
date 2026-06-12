import React from "react";
import { theme } from "antd";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
    CartesianGrid,
} from "recharts";

{/*DEFINIMOS LA INTERFAZ PARA LOS DATOS DEL GRÁFICO */}
interface LineChartData {
    CICLO: number;
    APROBADO: number;
    MODIFICADO: number;
    DEVENGADO?: number;
    PAGADO: number;
}

{/*COMPONENTE PARA LAS VARIACIONES DEL GRAFICO*/}
const CustomTooltip = ({ active, payload }: any) => {
    const { token } = theme.useToken();

    if (!active || !payload) return null;

    const formatValue = (value: number) =>
        `$${Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
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
            {payload.map((entry: any) => (
                <div
                    key={entry.dataKey}
                    style={{
                        whiteSpace: "nowrap",
                        color: entry.color || token.colorText,
                        marginTop: 2,
                    }}
                >
                    {`${entry.name}: ${formatValue(Number(entry.value))}`}
                </div>
            ))}
        </div>
    );
};

const VariacionLabel = (props: any) => {
    const { x, y, index, data } = props;

    if (!x || !y || !data || !data[index] || index === 0 || !data[index - 1]) {
        return null;
    }

    const valorActual = data[index]?.MODIFICADO;
    const valorAnterior = data[index - 1]?.MODIFICADO;

    if (valorAnterior === 0 || valorAnterior === undefined || valorActual === undefined) {
        return null;
    }

    const variacion = ((valorActual / valorAnterior) - 1) * 100;
    const esPositiva = variacion >= 0;
    const color = esPositiva ? "#52c41a" : "#f5222d";
    const flecha = esPositiva ? "▲" : "▼";

    return (
        <text
            x={x}
            y={y - 18}
            fill={color}
            fontSize={11}
            fontWeight="600"
            textAnchor="middle"
        >
            {`${flecha}${Math.abs(variacion).toFixed(1)}%`}
        </text>
    );
};

{/*CHART SECTION*/}
export const LineChartComponent: React.FC<{ data: LineChartData[] }> = ({ data}) =>{
    // ordenamos los datos cronológicamente para el calculo de la variacion
    const sortedData = [...data].sort((a,b) => a.CICLO - b.CICLO);

    const formatYAxis = (value: number) => `${(value).toLocaleString('en-US')} `;

    return(
        <div style={{ width: "100%", height: 360, marginTop: "10px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={sortedData} 
          margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} /> 
          <XAxis dataKey="CICLO" />
          <YAxis  tickFormatter={formatYAxis} width={50} axisLine={false} /> 
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />

          <Line
            name="APROBADO"
            type="monotone"
            dataKey="APROBADO"
            stroke="#1677ff"
            strokeWidth={2}
            dot={{ r: 4 }}
          />

          <Line
            name="MODIFICADO"
            type="monotone"
            dataKey="MODIFICADO"
            stroke="#52c41a"
            strokeWidth={3}
            dot={{ r: 4, fill: "#52c41a" }}
          >
            {/* Etiquetas de variación interanual */}
            <LabelList 
              content={(props) => <VariacionLabel {...props} data={sortedData} />}
            />
          </Line>

          <Line
            name="PAGADO"
            type="monotone"
            dataKey="PAGADO"
            stroke="#f5222d"
            strokeWidth={3}
            //strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
      {/*NOTA DEL GTRAFICO*/}
      <p
        style={{
            marginTop: -33,
            fontSize: 12,
            fontStyle: "bold",
        }}
      >
        Notas:
        <br />
       1. El monto pagado del ejercicion 2026 corresponde al avance del PEF al cierre del primer trimestre.
       <br />
       2. Las variaciones corresponden al comparativo del monto modificado.
      </p>
    </div>
    );


};