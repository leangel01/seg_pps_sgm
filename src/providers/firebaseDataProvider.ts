import type {
  BaseRecord,
  CustomParams,
  CustomResponse,
  DataProvider,
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
  DeleteManyParams,
  DeleteManyResponse,
} from "@refinedev/core";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebaseClient";

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({ resource, pagination }: GetListParams): Promise<GetListResponse<TData>> => {
    const col = collection(db, resource);
    const snapshot = await getDocs(col);
    const items = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as TData[];
    const total = items.length;
    const page = pagination?.currentPage ?? 1;
    const perPage = pagination?.pageSize ?? 10;
    const start = (page - 1) * perPage;
    const data = items.slice(start, start + perPage);
    return { data, total };
  },

  getOne: async <TData extends BaseRecord = BaseRecord>({ resource, id }: GetOneParams): Promise<GetOneResponse<TData>> => {
    const ref = doc(db, resource, String(id));
    const snap = await getDoc(ref);
    const data = snap.exists()
      ? ({ id: snap.id, ...(snap.data() as any) } as TData)
      : ({} as TData);
    return { data };
  },

  getMany: async <TData extends BaseRecord = BaseRecord>({ resource, ids }: GetManyParams): Promise<GetManyResponse<TData>> => {
    const promises = ids.map(async (id: any) => {
      const snap = await getDoc(doc(db, resource, String(id)));
      return snap.exists() ? ({ id: snap.id, ...(snap.data() as any) } as TData) : (null as any);
    });
    const results = (await Promise.all(promises)).filter(Boolean) as TData[];
    return { data: results };
  },

  create: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, variables }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    const ref = await addDoc(collection(db, resource), variables as any);
    const snap = await getDoc(ref);
    return { data: { id: ref.id, ...(snap.data() as any) } as TData };
  },

  update: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, id, variables }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    const ref = doc(db, resource, String(id));
    await updateDoc(ref, variables as any);
    const snap = await getDoc(ref);
    return { data: { id: snap.id, ...(snap.data() as any) } as TData };
  },

  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, id }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    await deleteDoc(doc(db, resource, String(id)));
    return { data: { id } as TData };
  },

  deleteMany: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, ids }: DeleteManyParams<TVariables>): Promise<DeleteManyResponse<TData>> => {
    const results: TData[] = [];
    for (const id of ids) {
      await deleteDoc(doc(db, resource, String(id)));
      results.push({ id } as unknown as TData);
    }
    return { data: results };
  },

  getApiUrl: () => "",
  custom: async <TData extends BaseRecord = BaseRecord, TQuery = unknown, TPayload = unknown>(params: CustomParams<TQuery, TPayload>): Promise<CustomResponse<TData>> => {
    void params;
    return { data: [] as unknown as TData };
  },
};
