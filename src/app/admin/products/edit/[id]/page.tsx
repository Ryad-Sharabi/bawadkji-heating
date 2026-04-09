"use client";

import { Authenticated } from "@refinedev/core";
import { Form, Input, Select, Switch, Upload, Image, Button, Space, App, Card, Spin, Progress } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PRODUCT_CATEGORIES } from "@constants/product-categories";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUpdate } from "@refinedev/core";
import { useQueryClient } from "@tanstack/react-query";

const { TextArea } = Input;

type ProductData = {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  images: string[];
  available: boolean;
};

function EditProductForm() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [form] = Form.useForm();
  const router = useRouter();
  const { mutate: update } = useUpdate();
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [uploading, setUploading] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, { credentials: "include", cache: "no-store" });
      if (!res.ok) {
        setProduct(null);
        return;
      }
      const data = await res.json();
      setProduct(data as ProductData);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        description: product.description ?? "",
        category: product.category,
        images: Array.isArray(product.images) ? product.images : [],
        available: product.available ?? true,
      });
    }
  }, [product, form]);

  const uploadFile = async (file: File, onProgress?: (percent: number) => void): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");
      xhr.withCredentials = true;

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress?.(percent);
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300 && data.url) {
            onProgress?.(100);
            resolve(data.url as string);
            return;
          }
          reject(new Error(data.error || "فشل الرفع"));
        } catch {
          reject(new Error("فشل قراءة استجابة الرفع"));
        }
      };

      xhr.onerror = () => reject(new Error("فشل الاتصال أثناء الرفع"));
      xhr.send(formData);
    });
  };

  const onFinish = (values: Record<string, unknown>) => {
    if (!id) return;
    setSubmitting(true);
    update(
      { resource: "products", id, values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ predicate: (q) => (q.queryKey as string[]).includes("products") });
          message.success("تم تحديث المنتج");
          router.push("/admin/products");
        },
        onError: () => {
          message.error("فشل تحديث المنتج");
          setSubmitting(false);
        },
      }
    );
  };

  if (!id) return null;
  if (loading) return <Spin size="large" style={{ display: "block", margin: 48 }} />;
  if (!product) return <Card>المنتج غير موجود</Card>;

  return (
    <Card title="تعديل المنتج">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="اسم المنتج" rules={[{ required: true, message: "مطلوب" }]}>
          <Input placeholder="اسم المنتج" size="large" />
        </Form.Item>
        <Form.Item name="description" label="الوصف">
          <TextArea rows={4} placeholder="وصف المنتج" />
        </Form.Item>
        <Form.Item name="category" label="الفئة" rules={[{ required: true, message: "مطلوب" }]}>
          <Select
            placeholder="اختر الفئة"
            size="large"
            options={PRODUCT_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
          />
        </Form.Item>
        <Form.Item name="images" label="الصور">
          <ProductImagesUpload
            uploading={uploading}
            setUploading={setUploading}
            uploadFile={uploadFile}
            message={message}
          />
        </Form.Item>
        <Form.Item name="available" label="متوفر" valuePropName="checked">
          <Switch checkedChildren="متوفر" unCheckedChildren="غير متوفر" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" size="large" loading={submitting}>
              حفظ
            </Button>
            <Button size="large" onClick={() => router.push("/admin/products")}>
              إلغاء
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default function AdminProductsEditPage() {
  return (
    <Authenticated key="admin-products-edit" redirectOnFail="/admin/login">
      <EditProductForm />
    </Authenticated>
  );
}

function ProductImagesUpload({
  uploading,
  setUploading,
  uploadFile,
  message,
  value = [],
  onChange,
}: {
  uploading: boolean;
  setUploading: (v: boolean) => void;
  uploadFile: (f: File, onProgress?: (percent: number) => void) => Promise<string>;
  message: { success: (s: string) => void; error: (s: string) => void };
  value?: string[];
  onChange?: (urls: string[]) => void;
}) {
  const urls = Array.isArray(value) ? value : [];
  const [progress, setProgress] = useState(0);

  const addImage = async (file: File) => {
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadFile(file, (percent) => setProgress(percent));
      onChange?.([...urls, url]);
      message.success("تم رفع الصورة");
    } catch {
      message.error("فشل رفع الصورة");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const removeImage = (index: number) => {
    const next = urls.filter((_, i) => i !== index);
    onChange?.(next);
  };

  return (
    <div>
      <Space wrap size="small">
      {urls.map((url, i) => (
        <div key={url} style={{ position: "relative" }}>
          <Image src={url} alt="" width={80} height={80} style={{ objectFit: "cover" }} />
          <Button
            type="text"
            danger
            size="small"
            style={{ position: "absolute", top: 0, right: 0 }}
            onClick={() => removeImage(i)}
          >
            ×
          </Button>
        </div>
      ))}
      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={(file) => {
          addImage(file);
          return false;
        }}
        disabled={uploading}
      >
        <div
          style={{
            width: 80,
            height: 80,
            border: "1px dashed #d9d9d9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <PlusOutlined /> {uploading ? "..." : "إضافة"}
        </div>
      </Upload>
      </Space>
      {uploading && (
        <div style={{ marginTop: 10, maxWidth: 220 }}>
          <Progress percent={progress} size="small" status="active" />
        </div>
      )}
    </div>
  );
}
