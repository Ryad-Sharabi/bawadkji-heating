"use client";

import { useEffect, useState, useCallback } from "react";
import { Authenticated } from "@refinedev/core";
import { Card, Table, Tag, Space, Image, Button } from "antd";
import { PRODUCT_CATEGORIES } from "@constants/product-categories";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useDelete } from "@refinedev/core";
import { useQueryClient } from "@tanstack/react-query";

const categoryMap = Object.fromEntries(PRODUCT_CATEGORIES.map((c) => [c.value, c.label]));

type ProductRow = {
  id: string;
  name: string;
  category: string;
  available: boolean;
  images: string[];
};

function ProductsList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [list, setList] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { mutate: deleteOne } = useDelete();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products?_start=0&_end=50&_sort=createdAt&_order=desc", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = (id: string) => {
    if (typeof window === "undefined" || !window.confirm("حذف هذا المنتج؟")) return;
    deleteOne(
      { resource: "products", id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ predicate: (q) => (q.queryKey as string[]).includes("products") });
          fetchProducts();
          router.refresh();
        },
      }
    );
  };

  return (
    <div style={{ padding: 0 }}>
      <Card
        title="المنتجات"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/admin/products/create")}>
            إضافة منتج
          </Button>
        }
      >
        <Table
          dataSource={list}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        >
          <Table.Column dataIndex="name" title="الاسم" />
          <Table.Column
            dataIndex="category"
            title="الفئة"
            render={(v: string) => categoryMap[v] ?? v}
          />
          <Table.Column
            dataIndex="available"
            title="متوفر"
            render={(v: boolean) =>
              v ? <Tag color="green">متوفر</Tag> : <Tag color="default">غير متوفر</Tag>
            }
          />
          <Table.Column
            dataIndex="images"
            title="الصور"
            render={(images: string[]) => (
              <Space size="small">
                {(Array.isArray(images) ? images : []).slice(0, 2).map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt=""
                    width={40}
                    height={40}
                    style={{ objectFit: "cover" }}
                  />
                ))}
                {(Array.isArray(images) ? images : []).length > 2 && (
                  <span>+{(images as string[]).length - 2}</span>
                )}
              </Space>
            )}
          />
          <Table.Column
            title="إجراءات"
            render={(_, record: ProductRow) => (
              <Space>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => router.push(`/admin/products/edit/${record.id}`)}
                />
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
              </Space>
            )}
          />
        </Table>
      </Card>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Authenticated key="admin-products" redirectOnFail="/admin/login">
      <ProductsList />
    </Authenticated>
  );
}
