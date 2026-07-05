export interface AdminNavItem {
  num: string;
  label: string;
  href: string;
  isActive: (pathname: string) => boolean;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { num: "01", label: "Dashboard", href: "/admin", isActive: (p) => p === "/admin" },
  { num: "02", label: "Applications", href: "/admin/applications", isActive: (p) => p.startsWith("/admin/applications") },
  { num: "03", label: "Classes", href: "/admin/classes", isActive: (p) => p.startsWith("/admin/classes") },
  { num: "04", label: "Shop items", href: "/admin/items", isActive: (p) => p.startsWith("/admin/items") || p.startsWith("/admin/orders") },
  { num: "05", label: "Profile", href: "/admin/profile", isActive: (p) => p.startsWith("/admin/profile") },
  { num: "06", label: "Security", href: "/admin/security", isActive: (p) => p.startsWith("/admin/security") },
  { num: "07", label: "System settings", href: "/admin/system", isActive: (p) => p.startsWith("/admin/system") },
];

/** Topbar breadcrumb + title for the current route. */
export function routeMeta(pathname: string): { crumb: string; title: string } {
  if (pathname === "/admin") return { crumb: "Overview", title: "Good morning, Khady" };

  if (pathname === "/admin/applications") return { crumb: "Bake School", title: "Student applications" };
  if (pathname.startsWith("/admin/applications/")) return { crumb: "Bake School · Applications", title: "Application" };

  if (pathname === "/admin/classes") return { crumb: "Bake School", title: "Classes & cohorts" };
  if (pathname.startsWith("/admin/classes/")) return { crumb: "Bake School · Classes", title: "Cohort" };

  if (pathname === "/admin/items/new") return { crumb: "Shop · Items", title: "New item" };
  if (pathname.endsWith("/edit")) return { crumb: "Shop · Items", title: "Edit item" };
  if (pathname === "/admin/items") return { crumb: "Shop", title: "Shop items" };
  if (pathname.startsWith("/admin/items/")) return { crumb: "Shop · Items", title: "Item & orders" };
  if (pathname.startsWith("/admin/orders/")) return { crumb: "Shop · Orders", title: "Order" };

  if (pathname.startsWith("/admin/profile")) return { crumb: "Account", title: "Admin profile" };
  if (pathname.startsWith("/admin/security")) return { crumb: "Account", title: "Security" };
  if (pathname.startsWith("/admin/system")) return { crumb: "Configuration", title: "System settings" };

  return { crumb: "Admin", title: "Admin console" };
}
