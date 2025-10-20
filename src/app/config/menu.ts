import { type LucideIcon } from 'lucide-react';

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  badge?: string;
  items?: SubMenuItem[];
  roles?: string[]; // Roles có thể access menu này
  permissions?: string[]; // Permissions cần thiết
}

export interface SubMenuItem {
  title: string;
  url: string;
  badge?: string;
  roles?: string[];
  permissions?: string[];
}

export interface ProjectItem {
  name: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  roles?: string[];
}

// Main Navigation Menu - Empty for auth-only template
export const navMain: MenuItem[] = [];

// Quick Access Projects - Empty for auth-only template
export const projects: ProjectItem[] = [];

// Team/Organization info - Empty for auth-only template
export const teams: { name: string; logo: LucideIcon; plan: string }[] = [];

// Helper function để filter menu theo user role
export const filterMenuByRole = (menu: MenuItem[], userRoles: string[]): MenuItem[] => {
  return menu.filter((item) => {
    // Nếu không có role requirement, cho phép tất cả
    if (!item.roles || item.roles.length === 0) {
      return true;
    }

    // Check nếu user có ít nhất 1 role được phép
    const hasRole = item.roles.some((role) => userRoles.includes(role));

    if (hasRole && item.items) {
      // Filter sub-items theo role
      item.items = item.items.filter((subItem) => {
        if (!subItem.roles || subItem.roles.length === 0) {
          return true;
        }
        return subItem.roles.some((role) => userRoles.includes(role));
      });
    }

    return hasRole;
  });
};

// Helper function để filter projects theo user role
export const filterProjectsByRole = (projects: ProjectItem[], userRoles: string[]): ProjectItem[] => {
  return projects.filter((project) => {
    if (!project.roles || project.roles.length === 0) {
      return true;
    }
    return project.roles.some((role) => userRoles.includes(role));
  });
};
