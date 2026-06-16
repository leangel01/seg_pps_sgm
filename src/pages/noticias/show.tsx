import { DateField, MarkdownField, Show } from "@refinedev/antd";
import { useOne, useShow } from "@refinedev/core";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Card, Col, Divider, Row, Space, Tag, Typography } from "antd";
import { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";

const { Title, Text } = Typography;

export const NoticiasShow = () => {
  const { mode } = useContext(ColorModeContext);
  const isDark = mode === "dark";

  const {
    result: record,
    query: { isLoading },
  } = useShow({});

  const {
    result: category,
    query: { isLoading: categoryIsLoading },
  } = useOne({
    resource: "categories",
    id: record?.category?.id || "",
    queryOptions: {
      enabled: !!record,
    },
  });

  const categoryIcon =
    record?.category?.id === "cat-cartografia"
      ? <GlobalOutlined />
      : record?.category?.id === "cat-adm-fin"
        ? <DollarOutlined />
        : record?.category?.id === "cat-normativa"
          ? <SafetyCertificateOutlined />
          : <FileTextOutlined />;

  return (
    <Show isLoading={isLoading}>
      <Card
        style={{
          borderRadius: 18,
          border: isDark ? "1px solid #3a2a33" : "1px solid #efe3e8",
          boxShadow: isDark ? "0 10px 30px rgba(0, 0, 0, 0.35)" : "0 10px 30px rgba(155, 34, 71, 0.08)",
          background: isDark ? "linear-gradient(145deg, #17181b 0%, #1f232a 100%)" : "linear-gradient(145deg, #fff 0%, #fffafc 100%)",
        }}
      >
        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={16}>
            <Tag color="magenta" style={{ borderRadius: 999, padding: "2px 10px" }}>
              {record?.status ?? "published"}
            </Tag>
            <Title level={2} style={{ marginTop: 8, marginBottom: 8, color: "#9b2247" }}>
              {record?.title}
            </Title>
            <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
              <Text strong>ID:</Text> {record?.id}
            </Text>
            <Space direction="vertical" size="small">
              <Text type="secondary">
                <CalendarOutlined style={{ color: "#9b2247", marginRight: 8 }} />
                Creado: <DateField value={record?.createdAt} />
              </Text>
              <Text type="secondary">
                <ClockCircleOutlined style={{ color: "#9b2247", marginRight: 8 }} />
                Actualizado: <DateField value={record?.updatedAt ?? record?.createdAt} />
              </Text>
            </Space>
            <Divider />
            <div
              style={{
                maxHeight: 420,
                overflowY: "auto",
                paddingRight: 6,
                lineHeight: 1.7,
              }}
            >
              <MarkdownField value={record?.content} />
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              size="small"
              style={{
                borderRadius: 16,
                background: isDark ? "#20242b" : "#fff6fa",
                border: isDark ? "1px solid #3a2a33" : "1px solid #f2dbe4",
              }}
            >
              <Title level={5} style={{ color: "#9b2247", marginBottom: 12 }}>
                Resumen
              </Title>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {categoryIcon}
                  <div>
                    <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Categoría</Text>
                    <Text strong>{categoryIsLoading ? "Cargando..." : category?.title ?? "Sin categoría"}</Text>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FileTextOutlined style={{ color: "#9b2247" }} />
                  <div>
                    <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Estado</Text>
                    <Text strong style={{ textTransform: "capitalize" }}>{record?.status ?? "published"}</Text>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CalendarOutlined style={{ color: "#9b2247" }} />
                  <div>
                    <Text type="secondary" style={{ display: "block", fontSize: 12 }}>Fecha de publicación</Text>
                    <DateField value={record?.createdAt} />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </Show>
  );
};
