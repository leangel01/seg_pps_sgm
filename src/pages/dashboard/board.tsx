import React, {useState, useMemo} from "react";
import {Card, Select, Row, Col, Typography, Space, Affix} from "antd"

const {Title, Text} = Typography;


{/*IMPORTACION DE LOSDATOS*/}
import gastoHistorico from "../../data/gasto_historico.json";


// ---------------------------------------------------------------
{/*IMPORTACION DE LOS COMPONENTES DE GRAFICO*/}
import { LineChartComponent } from "../../components/charts/LineChart";

// ---------------------------------------------------------------
{/*DEFINICION DE LAS INTERFACES*/}
interface GastoHistorico {
    [ramo: string]: {
        [ur:string]: {
            [ciclo: string]: {
                APROBADO: number;
                MODIFICADO: number;
                DEVENGADO?: number| undefined;
                PAGADO: number;
            }
        }
    };
}


// CASTEO DE DATOS A SUS RESPECTIVAS INTERFACES
const gHistoricoDatos = gastoHistorico as GastoHistorico;

export const BoardView: React.FC = () => {

// --- ESTADOS DE FILTROS ---
  const initialRamo = Object.keys(gHistoricoDatos)[0];
  const initialUR = Object.keys(gHistoricoDatos[initialRamo])[0];

  const [selectedRamo, setSelectedRamo] = useState<string>(initialRamo);
  const [selectedUR, setSelectedUR] = useState<string>(initialUR);



// DATOS PARA LOS GRAFICOS
const currentLineChartData = useMemo(
  () =>
    Object.entries(gHistoricoDatos[selectedRamo]?.[selectedUR] ?? {}).map(
      ([ciclo, values]) => ({
        CICLO: Number(ciclo),
        APROBADO: values.APROBADO ?? 0,
        MODIFICADO: values.MODIFICADO ?? 0,
        DEVENGADO: values.DEVENGADO ?? 0,
        PAGADO: values.PAGADO ?? 0,
      })
    ),
  [selectedRamo, selectedUR]
);
  
    return (
        <div style={{padding: "24px", minHeight: "100vh"}}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Affix offsetTop={64}>
                <Card size="small" style={{borderRadius: "8px", borderTop: "4px solid #9b2247", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"}}>
                    <Row gutter={16} align="middle">
                        {/*SELECTOR DE AÑO*/}
                        <Col xs={24} md={6}>
                            <Select placeholder="Seleccionar año" style={{width: "100%"}}>
                                <Select.Option value="2023">2023</Select.Option>
                                <Select.Option value="2024">2024</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                </Card>
            </Affix>
            <Row>
                <Col span={24}>
                    <Card
                    title ={"Ejercicio histórico del gasto"}
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
                    title ={"Gasto por programa presupuestario"}
                    style = {{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                    >
                    Seccion de grafico por programa presupuestario
                    </Card>
                </Col>
            </Row>

            </Space>   
        </div>
    );
};