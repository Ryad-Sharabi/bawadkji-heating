"use client";

import { useEffect, useState, useCallback } from "react";
import { Authenticated } from "@refinedev/core";
import { Typography, Card, Row, Col, Flex } from "antd";
import {
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@constants/product-categories";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const { Title, Paragraph, Text } = Typography;

const CHART_COLORS = [
  "#e61e26",
  "#1890ff",
  "#52c41a",
  "#faad14",
  "#722ed1",
  "#13c2c2",
  "#eb2f96",
  "#fa8c16",
];

const BRAND_RED = "#e61e26";

type ProductItem = { id: string; category: string; available: boolean };

function StatItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Flex align="center" gap={12} style={{ flexWrap: "wrap" }}>
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: `${color}14`,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <div>
        <Paragraph style={{ margin: 0, fontSize: 12, color: "#8c8c8c" }}>{label}</Paragraph>
        <Text strong style={{ fontSize: 18, display: "block" }}>
          {value}
        </Text>
      </div>
    </Flex>
  );
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products?_start=0&_end=500&_sort=createdAt&_order=desc", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const total = products.length;
  const available = products.filter((p) => p.available).length;
  const unavailable = total - available;

  const categoryCounts = PRODUCT_CATEGORIES.map((cat) => ({
    name: cat.label,
    value: products.filter((p) => p.category === cat.value).length,
    key: cat.value,
  })).filter((d) => d.value > 0);

  const chartData = categoryCounts.map((d, i) => ({
    name: `${d.name} (${d.value})`,
    value: d.value,
    key: d.key,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const categoriesWithProducts = categoryCounts.length;

  return (
    <Authenticated key="admin-dashboard" redirectOnFail="/admin/login">
      <div style={{ padding: 0 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          لوحة التحكم
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 24 }}>
          مرحباً بك في لوحة تحكم بوادقجي للتدفئة.
        </Paragraph>

        <Card
          title="توزيع المنتجات حسب الفئة"
          style={{ marginBottom: 24 }}
          loading={loading}
          extra={
            <Link href="/admin/products" style={{ fontSize: 12, color: "#8c8c8c" }}>
              عرض الكل
            </Link>
          }
        >
          <div style={{ marginBottom: 24 }}>
            {chartData.length > 0 ? (
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.key} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value ?? 0, "العدد"]} />
                    <Legend layout="vertical" align="left" verticalAlign="middle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 48, color: "#8c8c8c" }}>
                لا توجد منتجات لعرض التوزيع.
              </div>
            )}
          </div>

          <Row gutter={[16, 16]} style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
            <Col xs={24} sm={12} xl={6}>
              <StatItem
                icon={<ShoppingOutlined style={{ fontSize: 18 }} />}
                label="إجمالي المنتجات"
                value={total}
                color={BRAND_RED}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <StatItem
                icon={<CheckCircleOutlined style={{ fontSize: 18 }} />}
                label="متوفر"
                value={available}
                color="#52c41a"
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <StatItem
                icon={<CloseCircleOutlined style={{ fontSize: 18 }} />}
                label="غير متوفر"
                value={unavailable}
                color="#8c8c8c"
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <StatItem
                icon={<AppstoreOutlined style={{ fontSize: 18 }} />}
                label="فئات مستخدمة"
                value={categoriesWithProducts}
                color="#1890ff"
              />
            </Col>
          </Row>
        </Card>
      </div>
    </Authenticated>
  );
}
