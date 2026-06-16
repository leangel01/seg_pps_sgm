import React, { useMemo, useState, useEffect } from "react";
import { Card, Select, Row, Col, Typography, Space, Affix, Checkbox } from "antd";

const { Title, Text } = Typography;

import { LineChartComponent } from "../../components/charts/LineChart";
import { BarchartComponent } from "../../components/charts/Barchart";
import { CurrentCycleKPIs } from "../../components/cards";
import { useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../providers/firebaseClient";

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

const emptyHistorico: GastoHistorico = {};
const emptyProgramas: GastoProgramaData = {};

export const BoardView: React.FC = () => {
  const [gHistoricoDatos, setGHistoricoDatos] = useState<GastoHistorico>(emptyHistorico);
  const [gProgramasDatos, setGProgramasDatos] = useState<GastoProgramaData>(emptyProgramas);

  const [selectedRamo, setSelectedRamo] = useState<string>("");
  const [selectedUR, setSelectedUR] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [showHistorical, setShowHistorical] = useState<boolean>(true);
  const [selectedProgram, setSelectedProgram] = useState<string>("");



  const availableYears = useMemo(() => {
    const years = Object.keys(gProgramasDatos[selectedRamo]?.[selectedUR] ?? {})
      .map(Number)
      .sort((a, b) => a - b);
    return years.map((year) => String(year));
  }, [selectedRamo, selectedUR, gProgramasDatos]);

  useEffect(() => {
    if (!selectedYear && availableYears.length) {
      setSelectedYear(availableYears[availableYears.length - 1]);
    }
  }, [availableYears, selectedYear]);

  const programOptions = useMemo(() => {
    const items = gProgramasDatos[selectedRamo]?.[selectedUR]?.[selectedYear] ?? [];
    return Array.from(new Set(items.map((item) => item.DENOMINACION))).sort((a, b) => a.localeCompare(b));
  }, [selectedRamo, selectedUR, selectedYear, gProgramasDatos]);

  useEffect(() => {
    if (!selectedProgram || !programOptions.includes(selectedProgram)) {
      setSelectedProgram(programOptions[0] ?? "");
    }
  }, [programOptions, selectedProgram]);

  const currentLineChartData = useMemo(() => {
    if (!selectedRamo || !selectedUR) return [];
    return Object.entries(gHistoricoDatos[selectedRamo]?.[selectedUR] ?? {}).map(([ciclo, values]) => ({
      CICLO: Number(ciclo),
      APROBADO: values.APROBADO ?? 0,
      MODIFICADO: values.MODIFICADO ?? 0,
      DEVENGADO: values.DEVENGADO ?? 0,
      PAGADO: values.PAGADO ?? 0,
    }));
  }, [selectedRamo, selectedUR, gHistoricoDatos]);

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
  }, [selectedRamo, selectedUR, selectedYear, selectedProgram, showHistorical, gProgramasDatos]);

  const currentCiclo = useMemo(() => {
    if (!selectedRamo || !selectedUR) return "";
    const ciclos = Object.keys(gHistoricoDatos[selectedRamo]?.[selectedUR] ?? {})
      .map(Number)
      .sort((a, b) => b - a);
    return ciclos[0]?.toString() || "";
  }, [selectedRamo, selectedUR, gHistoricoDatos]);

  // Fetch collections from Firestore and transform into the nested structures
  const fetchGastoHistorico = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "gasto_historico"));
      const result: GastoHistorico = {};
      snapshot.forEach((doc) => {
        const data: any = doc.data();
        const ramo = (data.sector || data.SECTOR || "") as string;
        const ur = (data.agency || data.AGENCY || data.agencia || data.AGENCIA || "") as string;
        const year = String(data.year ?? data.YEAR ?? data.year?.toString() ?? "");

        if (!ramo || !ur || !year) return;

        if (!result[ramo]) result[ramo] = {};
        if (!result[ramo][ur]) result[ramo][ur] = {};

        result[ramo][ur][year] = {
          APROBADO: Number(data.APROBADO ?? data.Aprobado ?? 0),
          MODIFICADO: Number(data.MODIFICADO ?? data.Modificado ?? 0),
          DEVENGADO: Number(data.DEVENGADO ?? data.Devengado ?? 0),
          PAGADO: Number(data.PAGADO ?? data.Pagado ?? 0),
        };
      });

      setGHistoricoDatos(result);
      // set default selections if not set
      const ramas = Object.keys(result);
      if (ramas.length) {
        const r = ramas[0];
        const urs = Object.keys(result[r] ?? {});
        const u = urs[0] ?? "";
        setSelectedRamo((prev) => prev || r);
        setSelectedUR((prev) => prev || u);
      }
    } catch (error) {
      console.error("Error fetching gasto_historico:", error);
    }
  }, []);

  const fetchGastoProgramas = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "gasto_programas"));
      const result: GastoProgramaData = {};
      snapshot.forEach((doc) => {
        const data: any = doc.data();
        const ramo = (data.sector || data.SECTOR || "") as string;
        const ur = (data.agency || data.AGENCY || data.agencia || data.AGENCIA || "") as string;
        const year = String(data.year ?? data.YEAR ?? data.year?.toString() ?? "");

        if (!ramo || !ur || !year) return;

        if (!result[ramo]) result[ramo] = {};
        if (!result[ramo][ur]) result[ramo][ur] = {};
        if (!result[ramo][ur][year]) result[ramo][ur][year] = [];

        const item: GastoProgramaItem = {
          DENOMINACION: data.DENOMINACION ?? data.denominacion ?? data.programa ?? "",
          Aprobado: Number(data.APROBADO ?? data.Aprobado ?? data.aprobado ?? 0),
          Devengado: Number(data.DEVENGADO ?? data.Devengado ?? data.devengado ?? 0),
          Modificado: Number(data.MODIFICADO ?? data.Modificado ?? data.modificado ?? 0),
          Pagado: Number(data.PAGADO ?? data.Pagado ?? data.pagado ?? 0),
        };

        result[ramo][ur][year].push(item);
      });

      setGProgramasDatos(result);
    } catch (error) {
      console.error("Error fetching gasto_programas:", error);
    }
  }, []);

  useEffect(() => {
    fetchGastoHistorico();
    fetchGastoProgramas();
  }, [fetchGastoHistorico, fetchGastoProgramas]);
  
    return (
        <div style={{padding: "24px", minHeight: "100vh"}}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Affix offsetTop={64}>
                <Card style={{borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"}}>
                    <CurrentCycleKPIs
                      ramo={selectedRamo}
                      ur={selectedUR}
                      ciclo={currentCiclo}
                      gHistoricoDatos={gHistoricoDatos}
                    />
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