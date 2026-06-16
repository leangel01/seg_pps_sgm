import { DateField, List, useTable } from "@refinedev/antd";
import { type BaseRecord, useMany } from "@refinedev/core";
import {
  CalendarOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { Card, Col, DatePicker, Row, Select, Space, Table, Tag, Typography } from "antd";
import { useNavigate } from "react-router";
import { useContext, useMemo, useState } from "react";
import { ColorModeContext } from "../../contexts/color-mode";

const { Text } = Typography;

const stripMarkdown = (value?: string) =>
  (value ?? "")
    .replace(/#{1,6}\s*/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/>\s?/g, "")
    .replace(/\n+/g, " ")
    .trim();

export const NoticiasList = () => {
  const navigate = useNavigate();
  const { mode } = useContext(ColorModeContext);
  const isDark = mode === "dark";

  const { result } = useTable({
    syncWithLocation: true,
  });

  const [categoryFilter, setCategoryFilter] = useState<string>();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const {
    result: { data: categories },
    query: { isLoading: categoryIsLoading },
  } = useMany({
    resource: "categories",
    ids: result?.data?.map((item) => item?.category).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!result?.data,
    },
  });

  const filteredData = useMemo(() => {
    const data = (result?.data ?? []) as BaseRecord[];

    return data.filter((item) => {
      const matchesCategory = !categoryFilter || item?.category?.id === categoryFilter;
      const createdAt = item?.createdAt ? new Date(item.createdAt as string).getTime() : null;
      const matchesDate = !dateRange || !createdAt
        ? true
        : createdAt >= new Date(dateRange[0]).getTime() && createdAt <= new Date(dateRange[1]).getTime();

      return matchesCategory && matchesDate;
    });
  }, [categoryFilter, dateRange, result?.data]);

  return (
    <List>
      <Card
        size="small"
        style={{
          marginBottom: 16,
          borderRadius: 14,
          border: isDark ? "1px solid #3a2a33" : "1px solid #f0dbe3",
          background: isDark ? "linear-gradient(145deg, #17181b 0%, #1f232a 100%)" : "linear-gradient(145deg, #fff 0%, #fffafc 100%)",
          color: isDark ? "#f5f7fa" : undefined,
        }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={8}>
            <Text strong style={{ display: "block", marginBottom: 6 }}>Categoría</Text>
            <Select
              allowClear
              placeholder="Filtrar por categoría"
              style={{ width: "100%" }}
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categories?.map((item) => ({ label: item.title, value: item.id }))}
            />
          </Col>
          <Col xs={24} md={10}>
            <Text strong style={{ display: "block", marginBottom: 6 }}>Rango de fechas</Text>
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              onChange={(values) =>
                setDateRange(
                  values && values[0] && values[1]
                    ? [values[0].format("YYYY-MM-DD"), values[1].format("YYYY-MM-DD")]
                    : null,
                )
              }
            />
          </Col>
          <Col xs={24} md={6}>
            <Text strong style={{ display: "block", marginBottom: 6 }}>Vista</Text>
            <Text type="secondary">{filteredData.length} noticias</Text>
          </Col>
        </Row>
      </Card>

      <Table
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        tableLayout="fixed"
        scroll={{ x: 1100 }}
        style={{ background: isDark ? "#17181b" : "#fff" }}
        onRow={(record) => ({
          onClick: () => navigate(`/noticias/show/${record.id}`),
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column
          title="Noticia"
          width="36%"
          render={(_, record: BaseRecord) => (
            <Space align="start">
              <FileTextOutlined style={{ color: "#9b2247", fontSize: 16, marginTop: 3 }} />
              <span>
                <Text strong style={{ display: "block", fontSize: 18 }}>{record.title}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>{record.id}</Text>
              </span>
            </Space>
          )}
        />
        <Table.Column
          title="Categoría"
          width="14%"
          render={(_, record: BaseRecord) =>
            categoryIsLoading ? (
              <>Cargando...</>
            ) : (
              <Tag color="magenta" icon={<FolderOpenOutlined />}>
                {categories?.find((item) => item.id === record?.category)?.title ?? "Sin categoría"}
              </Tag>
            )
          }
        />
        <Table.Column
          title="Fecha"
          width="12%"
          dataIndex="createdAt"
          render={(value: string) => (
            <Space>
              <CalendarOutlined style={{ color: "#9b2247" }} />
              <DateField value={value} />
            </Space>
          )}
        />
        <Table.Column
          title="Resumen"
          width="30%"
          dataIndex="content"
          render={(value: string) => {
            const plainText = stripMarkdown(value);
            return plainText ? <Text style={{ fontSize: 12, lineHeight: 1.4 }}>{plainText.slice(0, 130)}...</Text> : "-";
          }}
        />
      </Table>
    </List>
  );
};
