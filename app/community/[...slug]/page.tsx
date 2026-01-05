import { CommunityDashboardClient } from "@/modules/community/components/CommunityDashboardClient";

export function generateStaticParams() {
  return [{ slug: ["dashboard"] }];
}

export default function CommunityDashboard() {
  return <CommunityDashboardClient />;
}
