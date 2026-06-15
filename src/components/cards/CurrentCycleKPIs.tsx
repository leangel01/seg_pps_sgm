import React, { useMemo } from "react";
import { Row, Col, Typography } from "antd";
import { DollarOutlined, CheckCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
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
        availability: 0,
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

  const porcentajePagado = Math.min(100, Math.max(0, kpiData.porcentaje));
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const dash = (porcentajePagado / 100) * circumference;
  const dashOffset = circumference - dash;
  const angle = (porcentajePagado / 100) * 360 - 90;
  const svgSize = 72;
  const glowRadius = (svgSize / 100) * radius;
  const glowX = svgSize / 2 + glowRadius * Math.cos((angle * Math.PI) / 180);
  const glowY = svgSize / 2 + glowRadius * Math.sin((angle * Math.PI) / 180);

  return (
    <>
      <style>
        {`
          @keyframes progressGlow {
            0% { transform: translate(-50%, -50%) scale(0.92); opacity: 0.75; }
            45% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(0.92); opacity: 0.75; }
          }
        `}
      </style>
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
          extraValue={
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ position: "relative", width: 72, height: 72 }}>
                <svg width="72" height="72" viewBox="0 0 100 100" aria-label="Porcentaje pagado respecto al modificado">
                  <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(155, 34, 71, 0.14)" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#9b2247"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    transform="rotate(-90 50 50)"
                    style={{ filter: "drop-shadow(0 0 3px rgba(155, 34, 71, 0.35))" }}
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                    pointerEvents: "none",
                  }}
                >
                  <Text strong style={{ color: "#9b2247", fontSize: 11 }}>
                    {porcentajePagado.toFixed(0)}%
                  </Text>
                </div>
                <span
                  style={{
                    position: "absolute",
                    left: `${glowX}px`,
                    top: `${glowY}px`,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(155, 34, 71, 0.95) 0%, rgba(155, 34, 71, 0.72) 45%, rgba(155, 34, 71, 0.18) 75%)",
                    boxShadow: "0 0 10px rgba(155, 34, 71, 0.45)",
                    transform: "translate(-50%, -50%)",
                    animation: "progressGlow 1.4s ease-in-out infinite",
                  }}
                />
              </div>
              
            </div>
          }
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
    </>
  );
};
