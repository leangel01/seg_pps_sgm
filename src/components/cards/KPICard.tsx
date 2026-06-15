import React from "react";
import { Card, Statistic, Row, Col, Typography } from "antd";
import type { ReactNode } from "react";

const { Text } = Typography;

interface KPICardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  prefix?: string;
  suffix?: string;
  precision?: number;
  valueStyle?: React.CSSProperties;
  extraInfo?: ReactNode;
  extraValue?: ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  prefix,
  suffix,
  precision = 2,
  valueStyle,
  extraInfo,
  extraValue,
}) => {
  return (
    <Card
      size="small"
      style={{
        borderRadius: "8px",
        borderTop: "4px solid #9b2247",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Row gutter={12} align="middle">
        {icon && (
          <Col xs={4} style={{ textAlign: "center", fontSize: "24px" }}>
            {icon}
          </Col>
        )}
        <Col xs={icon ? 20 : 24}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Statistic
                title={title}
                value={value}
                prefix={prefix}
                suffix={suffix}
                precision={typeof value === "number" ? precision : undefined}
                valueStyle={
                  valueStyle || {
                    color: "#9b2247",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }
                }
              />
            </div>
            {extraValue && <div>{extraValue}</div>}
          </div>
        </Col>
      </Row>
      {extraInfo && (
        <div style={{ marginTop: 16 }}>
          {extraInfo}
        </div>
      )}
    </Card>
  );
};
