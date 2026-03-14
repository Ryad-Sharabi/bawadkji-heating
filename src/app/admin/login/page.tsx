"use client";

import { Form, Input, Button, Card, Typography, App } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title } = Typography;

export default function AdminLoginPage() {
  const { message } = App.useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.status !== 200) {
        message.error(data.error || "فشل تسجيل الدخول");
        return;
      }
      message.success("تم تسجيل الدخول");
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f0f2f5" }}>
      <Card style={{ width: 400 }} title={null}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          لوحة التحكم — بوادقجي للتدفئة
        </Title>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="البريد الإلكتروني"
            name="email"
            rules={[{ required: true, message: "أدخل البريد الإلكتروني" }]}
          >
            <Input type="email" size="large" placeholder="admin@bawadkji.com" />
          </Form.Item>
          <Form.Item
            label="كلمة السر"
            name="password"
            rules={[{ required: true, message: "أدخل كلمة السر" }]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              تسجيل الدخول
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
