import * as React from 'react';
import { useAuth } from '@/app/shared/contexts/auth.context';
import { navMain, projects, teams, filterMenuByRole, filterProjectsByRole } from '@/app/config/menu';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  // If not logged in, don't display sidebar
  if (!user) {
    return null;
  }

  // Filter menu and projects by user role
  const userRoles = [user.role]; // Convert single role to array
  const filteredNavMain = filterMenuByRole(navMain, userRoles);
  const filteredProjects = filterProjectsByRole(projects, userRoles);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavProjects projects={filteredProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
