import React, { useMemo, useState, useEffect } from "react";
import { Card, Select, Row, Col, Typography, Space, Affix, Checkbox } from "antd";

const { Title, Text } = Typography;

import gastoHistorico from "../../data/gasto_historico.json";
import gastoProgramas from "../../data/gasto_programas.json";

import { LineChartComponent } from "../../components/charts/LineChart";
import { BarchartComponent } from "../../components/charts/Barchart";

// ---------------------------------------------------------------
{/*DEFINICION DE LAS INTERFACES*/}
interface GastoHistorico {
  [ramo: string]: {
    [ur: string]: {
      [ciclo: string]: {
        APROBADO: number;
        MODIFICADO: number;
        DEVENGADO?: number | undefined;
        PAGADO: number;
      };
    };
  };
}

interface GastoProgramaItem {
  DENOMINACION: string;
  Aprobado?: number;
  Devengado?: number;
  Modificado?: number;
  Pagado?: number;
}

interface GastoProgramaData {
  [ramo: string]: {
    [ur: string]: {
      [year: string]: GastoProgramaItem[];
    };
  };
}

const gHistoricoDatos = gastoHistorico as GastoHistorico;
const gProgramasDatos = gastoProgramas as GastoProgramaData;

export const BoardView: React.FC = () => {
  const initialRamo = Object.keys(gHistoricoDatos)[0];
  const initialUR = Object.keys(gHistoricoDatos[initialRamo] ?? {})[0];

  const [selectedRamo, setSelectedRamo] = useState<string>(initialRamo);
  const [selectedUR, setSelectedUR] = useState<string>(initialUR);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [showHistorical, setShowHistorical] = useState<boolean>(false);
  const [selectedProgram, setSelectedProgram] = useState<string>("");



  const availableYears = useMemo(() => {
    const years = Object.keys(gProgramasDatos[selectedRamo]?.[selectedUR] ?? {})
      .map(Number)
      .sort((a, b) => a - b);
    return years.map((year) => String(year));
  }, [selectedRamo, selectedUR]);

  useEffect(() => {
    if (!selectedYear && availableYears.length) {
      setSelectedYear(availableYears[availableYears.length - 1]);
    }
  }, [availableYears, selectedYear]);

  const programOptions = useMemo(() => {
    const items = gProgramasDatos[selectedRamo]?.[selectedUR]?.[selectedYear] ?? [];
    return Array.from(new Set(items.map((item) => item.DENOMINACION))).sort((a, b) => a.localeCompare(b));
  }, [selectedRamo, selectedUR, selectedYear]);

  useEffect(() => {
    if (!selectedProgram || !programOptions.includes(selectedProgram)) {
      setSelectedProgram(programOptions[0] ?? "");
    }
  }, [programOptions, selectedProgram]);

  const currentLineChartData = useMemo(
    () =>
      Object.entries(gHistoricoDatos[selectedRamo]?.[selectedUR] ?? {}).map(([ciclo, values]) => ({
        CICLO: Number(ciclo),
        APROBADO: values.APROBADO ?? 0,
        MODIFICADO: values.MODIFICADO ?? 0,
        DEVENGADO: values.DEVENGADO ?? 0,
        PAGADO: values.PAGADO ?? 0,
      })),
    [selectedRamo, selectedUR]
  );

  const currentBarChartData = useMemo(() => {
    const source = gProgramasDatos[selectedRamo]?.[selectedUR] ?? {};

    if (showHistorical) {
      return Object.keys(source)
        .map(Number)
        .sort((a, b) => a - b)
        .map((year) => {
          const item = (source[String(year)] ?? []).find((entry) => entry.DENOMINACION === selectedProgram);
          return {
            label: String(year),
            aprobado: item?.Aprobado ?? 0,
            modificado: item?.Modificado ?? 0,
            pagado: item?.Pagado ?? 0,
            devengado: item?.Devengado ?? 0,
          };
        });
    }

    const item = (source[selectedYear] ?? []).find((entry) => entry.DENOMINACION === selectedProgram);
    return [
      {
        label: selectedYear || "Año",
        aprobado: item?.Aprobado ?? 0,
        modificado: item?.Modificado ?? 0,
        pagado: item?.Pagado ?? 0,
        devengado: item?.Devengado ?? 0,
      },
    ];
  }, [selectedRamo, selectedUR, selectedYear, selectedProgram, showHistorical]);
  
    return (
        <div style={{padding: "24px", minHeight: "100vh"}}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Affix offsetTop={64}>
                <Card size="small" style={{borderRadius: "8px", borderTop: "4px solid #9b2247", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"}}>
                    <Text strong>Espacio reservado para KPIs del ciclo más actual</Text>
                    <br />
                    <Text type="secondary">Aquí se colocarán las tarjetas informativas cuando se integren los indicadores.</Text>
                </Card>
            </Affix>
            <Row>
                <Col span={24}>
                    <Card
                    title ={"Ejercicio histórico del gasto (millones de pesos)."}
                    style = {{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                    > 
                    <LineChartComponent data={currentLineChartData} />
                    </Card>
                </Col>
            </Row>
            {/* SECCION DE GRAFICO POR PROGRAMA*/}
            <Row >
                <Col span={24}>
                    <Card
                    title={"Gasto por programa presupuestario"}
                    style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                    >
                    <Row gutter={[12, 12]} align="middle" style={{ marginBottom: 12 }}>
                      <Col xs={24} md={8}>
                        <Select
                          value={selectedYear}
                          onChange={setSelectedYear}
                          placeholder="Seleccionar año"
                          style={{ width: "100%" }}
                          options={availableYears.map((year) => ({ label: year, value: year }))}
                        />
                      </Col>
                      <Col xs={24} md={10}>
                        <Select
                          value={selectedProgram || undefined}
                          onChange={setSelectedProgram}
                          placeholder="Seleccionar programa"
                          style={{ width: "100%" }}
                          options={programOptions.map((program) => ({ label: program, value: program }))}
                        />
                      </Col>
                      <Col xs={24} md={6}>
                        <Checkbox checked={showHistorical} onChange={(e) => setShowHistorical(e.target.checked)}>
                          Histórico
                        </Checkbox>
                      </Col>
                    </Row>
                    <BarchartComponent
                      data={currentBarChartData}
                      title={selectedProgram ? `Programa: ${selectedProgram}` : "Seleccione un programa"}
                    />
                    </Card>
                </Col>
            </Row>

            </Space>   
        </div>
    );
};