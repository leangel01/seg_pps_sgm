import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const CategoryCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"ID"}
          name="id"
          rules={[
            {
              required: true,
              message: "Por favor ingresa un ID único para la categoría",
            },
            {
              pattern: /^[a-z0-9-]+$/,
              message: "El ID solo puede contener minúsculas, números y guiones",
            },
          ]}
        >
          <Input placeholder="ej: cat-adm-fin" />
        </Form.Item>
        <Form.Item
          label={"Title"}
          name="title"
          rules={[
            {
              required: true,
              message: "Por favor ingresa un título",
            },
          ]}
        >
          <Input placeholder="ej: Administración y Finanzas" />
        </Form.Item>
      </Form>
    </Create>
  );
};
