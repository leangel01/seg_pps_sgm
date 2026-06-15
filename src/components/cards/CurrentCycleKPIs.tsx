import React, { useMemo } from "react";
import { Row, Col, Typography } from "antd";
import { DollarOutlined, CheckCircleOutlined, PercentageOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { KPICard } from "./KPICard";

const { Text } = Typography;

interface CurrentCycleKPIsProps {
  ramo: string;
  ur: string;
  ciclo: string;
  gHistoricoDatos: {
    [ramo: string]: {
      [ur: string]: {
        [ciclo: string]: {
          APROBADO: number;
          MODIFICADO: number;
          DEVENGADO?: number;
          PAGADO: number;
        };
      };
    };
  };
}

export const CurrentCycleKPIs: React.FC<CurrentCycleKPIsProps> = ({
  ramo,
  ur,
  ciclo,
  gHistoricoDatos,
}) => {
  const kpiData = useMemo(() => {
    const data = gHistoricoDatos[ramo]?.[ur]?.[ciclo];
    if (!data) {
      return {
        aprobado: 0,
        modificado: 0,
        pagado: 0,
        porcentaje: 0,
        variacion: 0,
        direction: "up" as "up" | "down",
      };
    }

    const aprobado = data.APROBADO || 0;
    const modificado = data.MODIFICADO || 0;
    const pagado = data.PAGADO || 0;
    const porcentaje = modificado > 0 ? (pagado / modificado) * 100 : 0;
    const variacion = aprobado > 0 ? ((modificado - aprobado) / aprobado) * 100 : 0;
    const availability = modificado - pagado;
    const direction = variacion >= 0 ? "up" : "down";

    return {
      aprobado,
      modificado,
      pagado,
      porcentaje,
      variacion,
      availability,
      direction,
    };
  }, [ramo, ur, ciclo, gHistoricoDatos]);

  const variationIcon = kpiData.direction === "up" ? (
    <Text type="success">
      <ArrowUpOutlined /> {Math.abs(kpiData.variacion).toFixed(2)}%
    </Text>
  ) : (
    <Text type="danger">
      <ArrowDownOutlined /> {Math.abs(kpiData.variacion).toFixed(2)}%
    </Text>
  );

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8}>
        <KPICard
          title="Monto Modificado"
          value={kpiData.modificado}
          icon={<DollarOutlined />}
          prefix="$"
          suffix="M"
          precision={2}
          extraValue={variationIcon}
          extraInfo={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text type="secondary">Presupuesto aprobado:</Text>
              <Text strong>${kpiData.aprobado.toLocaleString(undefined, { maximumFractionDigits: 2 })}M</Text>
            </div>
          }
        />
      </Col>
      <Col xs={24} sm={12} md={8}>
        <KPICard
          title="Monto Pagado"
          value={kpiData.pagado}
          icon={<CheckCircleOutlined />}
          prefix="$"
          suffix="M"
          precision={2}
          extraValue={<Text type="secondary">{kpiData.porcentaje.toFixed(2)}%</Text>}
        />
      </Col>
      <Col xs={24} sm={12} md={8}>
        <KPICard
          title="Disponibilidad"
          value={kpiData.availability}
          icon={<DollarOutlined />}
          prefix="$"
          suffix="M"
          precision={2}
        />
      </Col>
    </Row>
  );
};
