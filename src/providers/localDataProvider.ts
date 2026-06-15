import type { BaseRecord, DataProvider } from "@refinedev/core";

import news from "../data/notas/news.json";
import categories from "../data/notas/categories.json";

const resources = {
  blog_posts: news as Array<Record<string, unknown>>,
  categories: categories as Array<Record<string, unknown>>,
};

const getResourceData = (resource: string) => {
  return [...(resources[resource as keyof typeof resources] ?? [])] as BaseRecord[];
};

const asDataProvider = (provider: unknown) => provider as DataProvider;

export const localDataProvider = asDataProvider({
  getList: async ({ resource }: any) => {
    const data = getResourceData(resource);

    return {
      data: data as BaseRecord[],
      total: data.length,
    } as any;
  },

  getMany: async ({ resource, ids }: any) => {
    const data = getResourceData(resource).filter((item) => ids.includes(String(item.id)));

    return {
      data: data as BaseRecord[],
    } as any;
  },

  getOne: async ({ resource, id }: any) => {
    const data = getResourceData(resource).find((item) => String(item.id) === String(id));

    return {
      data: (data ?? null) as BaseRecord | null,
    } as any;
  },

  create: async ({ resource, variables }: any) => {
    const data = getResourceData(resource);
    const newRecord = {
      id: `local-${resource}-${Date.now()}`,
      ...variables,
    };

    data.unshift(newRecord);

    return {
      data: newRecord as BaseRecord,
    } as any;
  },

  update: async ({ resource, id, variables }: any) => {
    const data = getResourceData(resource);
    const index = data.findIndex((item) => String(item.id) === String(id));

    if (index === -1) {
      return { data: null };
    }

    const updatedRecord = {
      ...data[index],
      ...variables,
      id,
    };

    data[index] = updatedRecord;

    return {
      data: updatedRecord as BaseRecord,
    } as any;
  },

  deleteOne: async ({ resource, id }: any) => {
    const data = getResourceData(resource);
    const index = data.findIndex((item) => String(item.id) === String(id));

    if (index === -1) {
      return { data: null } as any;
    }

    data.splice(index, 1);

    return {
      data: { id } as BaseRecord,
    } as any;
  },

  getApiUrl: () => "",

  custom: async () => {
    return { data: [] } as any;
  },

  getManyReference: async ({ resource }: any) => {
    const data = getResourceData(resource);

    return {
      data: data as BaseRecord[],
      total: data.length,
    } as any;
  },
});
