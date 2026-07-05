"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  adminItems,
  applications,
  orders as seedOrders,
  type AdminItem,
  type Application,
  type AppStatus,
  type ItemCategory,
  type Order,
  type OrderStatus,
} from "@/lib/admin/data";

export interface ItemDraft {
  forId: string | null;
  name: string;
  cat: ItemCategory;
  price: string;
  unit: string;
  lead: string;
  desc: string;
  img: string;
}

export interface AdminSettings {
  twofa: boolean;
  accepting: boolean;
  maintenance: boolean;
  notifApp: boolean;
  notifOrder: boolean;
  notifDaily: boolean;
  leadDays: number;
  maxOrders: number;
}

export interface AdminProfile {
  name: string;
  email: string;
  phone: string;
}

interface AdminApi {
  applications: Application[];
  items: AdminItem[];
  orders: Order[];
  getApplication: (id: string) => Application | undefined;
  getItem: (id: string) => AdminItem | undefined;
  /** Accepts the numeric part ("1041") or the full id ("#1041"). */
  getOrder: (id: string) => Order | undefined;
  setAppStatus: (id: string, status: AppStatus) => void;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  saveItem: (draft: ItemDraft) => void;
  settings: AdminSettings;
  toggleSetting: (key: keyof AdminSettings) => void;
  setSetting: (key: keyof AdminSettings, value: number) => void;
  profile: AdminProfile;
  saveProfile: (profile: AdminProfile) => void;
}

const AdminContext = createContext<AdminApi | null>(null);

const DEFAULT_SETTINGS: AdminSettings = {
  twofa: true,
  accepting: true,
  maintenance: false,
  notifApp: true,
  notifOrder: true,
  notifDaily: false,
  leadDays: 3,
  maxOrders: 12,
};

const DEFAULT_PROFILE: AdminProfile = {
  name: "Khady Asante",
  email: "khady@khadyskitchen.com",
  phone: "+233 24 000 0000",
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [appStatuses, setAppStatuses] = useState<Record<string, AppStatus>>({});
  const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderStatus>>({});
  const [itemEdits, setItemEdits] = useState<Record<string, Partial<AdminItem>>>({});
  const [newItems, setNewItems] = useState<AdminItem[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [profile, setProfile] = useState<AdminProfile>(DEFAULT_PROFILE);

  const items = useMemo(
    () =>
      [...adminItems, ...newItems].map((it) =>
        itemEdits[it.id] ? { ...it, ...itemEdits[it.id] } : it,
      ),
    [itemEdits, newItems],
  );

  const apps = useMemo(
    () =>
      applications.map((a) =>
        appStatuses[a.id] ? { ...a, status: appStatuses[a.id] } : a,
      ),
    [appStatuses],
  );

  const orders = useMemo(
    () =>
      seedOrders.map((o) =>
        orderStatuses[o.id] ? { ...o, status: orderStatuses[o.id] } : o,
      ),
    [orderStatuses],
  );

  const setAppStatus = useCallback((id: string, status: AppStatus) => {
    setAppStatuses((prev) => ({ ...prev, [id]: status }));
  }, []);

  const setOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrderStatuses((prev) => ({ ...prev, [orderId]: status }));
  }, []);

  const saveItem = useCallback((draft: ItemDraft) => {
    const clean = {
      name: draft.name.trim(),
      cat: draft.cat,
      price: Number(draft.price),
      unit: draft.unit || "Each",
      lead: draft.lead,
      desc: draft.desc,
      img:
        draft.img ||
        "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&q=80&auto=format&fit=crop",
    };
    if (draft.forId) {
      setItemEdits((prev) => ({ ...prev, [draft.forId as string]: clean }));
    } else {
      const id =
        draft.name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "new-item";
      setNewItems((prev) => [...prev, { id, ...clean }]);
    }
  }, []);

  const toggleSetting = useCallback((key: keyof AdminSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const setSetting = useCallback((key: keyof AdminSettings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const saveProfile = useCallback((next: AdminProfile) => setProfile(next), []);

  const api = useMemo<AdminApi>(
    () => ({
      applications: apps,
      items,
      orders,
      getApplication: (id) => apps.find((a) => a.id === id),
      getItem: (id) => items.find((it) => it.id === id),
      getOrder: (id) => {
        const full = id.startsWith("#") ? id : `#${id}`;
        return orders.find((o) => o.id === full);
      },
      setAppStatus,
      setOrderStatus,
      saveItem,
      settings,
      toggleSetting,
      setSetting,
      profile,
      saveProfile,
    }),
    [apps, items, orders, setAppStatus, setOrderStatus, saveItem, settings, toggleSetting, setSetting, profile, saveProfile],
  );

  return <AdminContext.Provider value={api}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminApi {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within an AdminProvider");
  return ctx;
}
