export interface AdminNavItem {
  label: string;
  href: string;
  isActive: (pathname: string) => boolean;
}

export interface AdminNavGroup {
  heading: string;
  items: AdminNavItem[];
}

/** Placeholder items point at "#": they're in the design but not built yet, so
 * the shell renders them as muted, non-navigable entries until a page lands. */
const never = () => false;

/**
 * Grouped admin navigation (matches the "Admin - Dashboard" design). Built pages
 * link to their route; designed-but-unbuilt entries use `href: "#"`.
 */
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    heading: "Operations",
    items: [
      { label: "Dashboard", href: "/admin", isActive: (p) => p === "/admin" },
      { label: "Orders", href: "#", isActive: never },
      { label: "Customers", href: "#", isActive: never },
    ],
  },
  {
    heading: "Bake School",
    items: [
      { label: "Applications", href: "/admin/applications", isActive: (p) => p.startsWith("/admin/applications") },
      { label: "Classes", href: "/admin/classes", isActive: (p) => p.startsWith("/admin/classes") },
      { label: "Schedule", href: "#", isActive: never },
      { label: "Certificates", href: "#", isActive: never },
    ],
  },
  {
    heading: "Shop",
    items: [
      { label: "Shop items", href: "/admin/items", isActive: (p) => p.startsWith("/admin/items") || p.startsWith("/admin/orders") },
    ],
  },
  {
    heading: "Money",
    items: [
      { label: "Payments", href: "#", isActive: never },
      { label: "Reports", href: "#", isActive: never },
    ],
  },
  {
    heading: "Admin",
    items: [
      { label: "Site content", href: "#", isActive: never },
      { label: "Team & roles", href: "#", isActive: never },
      { label: "Audit log", href: "#", isActive: never },
      { label: "Profile", href: "/admin/profile", isActive: (p) => p.startsWith("/admin/profile") },
      { label: "Security", href: "/admin/security", isActive: (p) => p.startsWith("/admin/security") },
      { label: "System settings", href: "/admin/system", isActive: (p) => p.startsWith("/admin/system") },
    ],
  },
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
