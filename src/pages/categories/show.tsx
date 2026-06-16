import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Card, Descriptions, Typography } from "antd";

const { Title } = Typography;

export const CategoryShow = () => {
  const { result: record, query } = useShow({});
  const { isLoading } = query;

  return (
    <Show isLoading={isLoading}>
      <Card>
        <Title level={4}>Detalles de la Categoría</Title>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
          <Descriptions.Item label="Título">{record?.title}</Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  );
};
