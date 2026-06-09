import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
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
const VariacionLabel = (props: any) => {
    const { x, y, index, data } = props;

    // validamos que existan datos
    if ( !data || !data[index] || index === 0 || !data[index -1] ){
        return null;
    }

    const valorActual = data[index].MODIFICADO;
    const valorAnterior = data[index - 1].MODIFICADO;

    // VALIDAMOS QUE EL VALOR ANTERIOR NO SEA CERO PARA EVITAR DIVISION POR CERO
    if (valorAnterior === 0 || valorAnterior === undefined || valorActual === undefined) {
        return null;
    }

    const variacion = ((valorActual/valorAnterior)-1)*100;
    const esPositiva = variacion >= 0;
    const color = esPositiva ? 'green' : 'red';
    const flecha = esPositiva ? '▲' : '▼';

    return (
        <g>
            <text>
                {`${flecha}${Math.abs(variacion).toFixed(1)}%`}
            </text>
        </g>
    );
};

{/*CHART SECTION*/}
