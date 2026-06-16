import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const CategoryEdit = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
          <Input disabled placeholder="ID no puede ser modificado" />
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
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
