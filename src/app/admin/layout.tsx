"use client";

import "@ant-design/v5-patch-for-react-19";
import { Refine, useIsAuthenticated } from "@refinedev/core";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App as AntdApp, Layout, Menu } from "antd";
import { DashboardOutlined, ShoppingOutlined } from "@ant-design/icons";
import { authProvider } from "@providers/auth-provider";
import { dataProvider } from "@providers/data-provider";
import { routerProvider } from "@providers/router-provider";
import { Header } from "@components/header";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback, useContext, Suspense } from "react";
import { SidebarContext } from "@providers/sidebar-provider";
import { ColorModeContext } from "@contexts/color-mode";

const SIDEBAR_ITEMS = [
  { key: "/admin", icon: <DashboardOutlined />, label: "لوحة التحكم" },
  { key: "/admin/products", icon: <ShoppingOutlined />, label: "المنتجات" },
];

const sidebarStylesLight = `
  .admin-sidebar-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
    border-inline-end: 1px solid rgba(0,0,0,0.06);
  }
  .admin-sidebar-brand {
    padding: 20px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    flex-shrink: 0;
  }
  .admin-sidebar-brand .brand-title {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
    letter-spacing: 0.02em;
  }
  .admin-sidebar-brand .brand-sub {
    font-size: 11px;
    color: #8c8c8c;
    margin-top: 2px;
  }
  .admin-sidebar-menu {
    flex: 1;
    padding: 12px 8px;
    overflow: auto;
  }
  .admin-sidebar-menu .ant-menu-item {
    height: 44px;
    line-height: 44px;
    margin-bottom: 4px;
    border-radius: 8px;
    font-weight: 500;
  }
  .admin-sidebar-menu .ant-menu-item-selected {
    background: rgba(230, 30, 38, 0.08) !important;
    color: #e61e26;
  }
  .admin-sidebar-menu .ant-menu-item:hover {
    color: #e61e26;
  }
`;

const sidebarStylesDark = `
  .admin-sidebar-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #1f1f1f 0%, #141414 100%);
    border-inline-end: 1px solid rgba(255,255,255,0.08);
  }
  .admin-sidebar-brand {
    padding: 20px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    flex-shrink: 0;
  }
  .admin-sidebar-brand .brand-title {
    font-size: 15px;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
    letter-spacing: 0.02em;
  }
  .admin-sidebar-brand .brand-sub {
    font-size: 11px;
    color: rgba(255,255,255,0.45);
    margin-top: 2px;
  }
  .admin-sidebar-menu {
    flex: 1;
    padding: 12px 8px;
    overflow: auto;
  }
  .admin-sidebar-menu .ant-menu-item {
    height: 44px;
    line-height: 44px;
    margin-bottom: 4px;
    border-radius: 8px;
    font-weight: 500;
    color: rgba(255,255,255,0.75);
  }
  .admin-sidebar-menu .ant-menu-item-selected {
    background: rgba(230, 30, 38, 0.2) !important;
    color: #e61e26;
  }
  .admin-sidebar-menu .ant-menu-item:hover {
    color: #e61e26;
  }
`;

function AdminLayoutInner({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const { data: authStatus } = useIsAuthenticated();
  const { mode } = useContext(ColorModeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const isDark = mode === "dark";

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 991px)");
    setIsMobile(mq.matches);
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    if (pathname?.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      document.documentElement.setAttribute("lang", "ar");
      document.documentElement.setAttribute("dir", "rtl");
    }
  }, [pathname]);

  const onMenuClick = useCallback(
    (key: string) => {
      router.push(key);
      if (isMobile) setSidebarOpen(false);
    },
    [router, isMobile]
  );

  if (isLoginPage) {
    return <>{children}</>;
  }
  if (authStatus?.authenticated === true) {
    const selectedKey =
      pathname === "/admin"
        ? "/admin"
        : pathname?.startsWith("/admin/products")
          ? "/admin/products"
          : pathname ?? "/admin";

    const sidebarContent = (
      <div className="admin-sidebar-wrap">
        <style>{isDark ? sidebarStylesDark : sidebarStylesLight}</style>
        <div className="admin-sidebar-brand">
          <div className="brand-title">لوحة الإدارة</div>
          <div className="brand-sub">بوادقجي للتدفئة</div>
        </div>
        <div className="admin-sidebar-menu">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={SIDEBAR_ITEMS}
            style={{ border: "none", background: "transparent" }}
            onClick={({ key }) => onMenuClick(key)}
          />
        </div>
      </div>
    );

    return (
      <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen, showHamburger: true }}>
        <div dir="rtl" lang="ar" style={{ minHeight: "100vh" }}>
          <Layout style={{ minHeight: "100vh" }}>
            {isMobile ? (
              <>
                {sidebarOpen && (
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: 1000,
                      background: "rgba(0,0,0,0.45)",
                    }}
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden
                  />
                )}
                <Layout.Sider
                  width={260}
                  theme={isDark ? "dark" : "light"}
                  collapsed={!sidebarOpen}
                  collapsedWidth={0}
                  style={{
                    position: isMobile ? "fixed" : "relative",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1001,
                    overflow: "hidden",
                  }}
                >
                  {sidebarContent}
                </Layout.Sider>
              </>
            ) : (
              <Layout.Sider
                width={260}
                theme={isDark ? "dark" : "light"}
                collapsed={!sidebarOpen}
                collapsedWidth={80}
                style={{ overflow: "hidden" }}
              >
                {sidebarContent}
              </Layout.Sider>
            )}
            <Layout>
              <Header />
              <Layout.Content style={{ padding: 24 }}>{children}</Layout.Content>
            </Layout>
          </Layout>
        </div>
      </SidebarContext.Provider>
    );
  }
  return <>{children}</>;
}

export default function AdminLayout({ children }: React.PropsWithChildren) {
  return (
    <AntdRegistry>
      <ColorModeContextProvider defaultMode="light">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#e61e26",
              colorPrimaryHover: "#c41a21",
              colorPrimaryActive: "#a3161c",
            },
          }}
        >
          <AntdApp>
            <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>...</div>}>
              <Refine
                routerProvider={routerProvider}
                authProvider={authProvider}
                dataProvider={dataProvider}
                resources={[
                  { name: "dashboard", list: "/admin" },
                  { name: "products", list: "/admin/products", create: "/admin/products/create", edit: "/admin/products/edit/:id" },
                ]}
                options={{ syncWithLocation: true }}
              >
                <AdminLayoutInner>{children}</AdminLayoutInner>
              </Refine>
            </Suspense>
          </AntdApp>
        </ConfigProvider>
      </ColorModeContextProvider>
    </AntdRegistry>
  );
}
