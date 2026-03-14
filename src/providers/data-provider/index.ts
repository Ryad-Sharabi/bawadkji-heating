"use client";

import type {
  DataProvider,
  BaseRecord,
  GetListParams,
  GetListResponse,
  GetOneParams,
  GetOneResponse,
  GetManyParams,
  GetManyResponse,
  CreateParams,
  CreateResponse,
  UpdateParams,
  UpdateResponse,
  DeleteOneParams,
  DeleteOneResponse,
} from "@refinedev/core";
import { stringify } from "query-string";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return `${window.location.origin}/api`;
  return `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api`;
};

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T; headers: Record<string, string> }> {
  const fullUrl = url.startsWith("http") ? url : `${getBaseUrl()}${url.startsWith("/") ? url : `/${url}`}`;
  const res = await fetch(fullUrl, {
    ...options,
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const headers: Record<string, string> = {};
  res.headers.forEach((v, k) => {
    headers[k.toLowerCase()] = v;
  });
  let data: T;
  const text = await res.text();
  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    data = {} as T;
  }
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error || res.statusText);
  }
  return { data, headers };
}

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
    pagination,
    sorters,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    const { currentPage = 1, pageSize = 10 } = pagination ?? {};
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    const sort = sorters?.[0];
    const query: Record<string, string> = {
      _start: String(start),
      _end: String(end),
      _sort: sort?.field ?? "createdAt",
      _order: sort?.order ?? "desc",
    };
    const { data, headers } = await request<unknown[]>(`/${resource}?${stringify(query)}`);
    const total = parseInt(headers["x-total-count"] ?? "0", 10) || (Array.isArray(data) ? data.length : 0);
    return {
      data: (Array.isArray(data) ? data : []) as TData[],
      total,
    };
  },

  getOne: async <TData extends BaseRecord = BaseRecord>({
    resource,
    id,
  }: GetOneParams): Promise<GetOneResponse<TData>> => {
    const { data } = await request<unknown>(`/${resource}/${id}`);
    return { data: data as TData };
  },

  create: async <TData extends BaseRecord = BaseRecord, TVariables = object>({
    resource,
    variables,
  }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    const { data } = await request<unknown>(`/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
    });
    return { data: data as TData };
  },

  update: async <TData extends BaseRecord = BaseRecord, TVariables = object>({
    resource,
    id,
    variables,
  }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    const { data } = await request<unknown>(`/${resource}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(variables),
    });
    return { data: data as TData };
  },

  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = object>(
    params: DeleteOneParams<TVariables>
  ): Promise<DeleteOneResponse<TData>> => {
    const { resource, id } = params;
    await request(`/${resource}/${id}`, { method: "DELETE" });
    return { data: { id } as TData };
  },

  getMany: async <TData extends BaseRecord = BaseRecord>({
    resource,
    ids,
  }: GetManyParams): Promise<GetManyResponse<TData>> => {
    const { data } = await request<unknown[]>(`/${resource}?${stringify({ id: ids })}`);
    return { data: (Array.isArray(data) ? data : []) as TData[] };
  },

  getApiUrl: () => getBaseUrl(),
};
