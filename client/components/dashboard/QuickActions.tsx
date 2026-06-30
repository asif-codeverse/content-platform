import {
  ClipboardList,
  FilePenLine,
  FilePlus2,
  Files,
  Users,
} from "lucide-react";

import QuickActionCard from "./QuickActionCard";

type Props = {
  role: string;
};

export default function QuickActions({
  role,
}: Props) {
  return (
    <section
      className="
        mt-10
        grid
        gap-6
        md:grid-cols-2
      "
    >
      <QuickActionCard
        href="/dashboard/create"
        title="Create Article"
        description="Write and publish a brand-new article."
        icon={<FilePlus2 size={22} />}
      />

      <QuickActionCard
        href="/dashboard/my"
        title="My Articles"
        description="View, edit and manage your own articles."
        icon={<Files size={22} />}
      />

      {(role === "EDITOR" || role === "ADMIN") && (
        <QuickActionCard
          href="/dashboard/manage"
          title="Manage Articles"
          description="Review and manage all platform articles."
          icon={<FilePenLine size={22} />}
        />
      )}

      {role === "ADMIN" && (
        <>
          <QuickActionCard
            href="/dashboard/pending"
            title="Pending Reviews"
            description="Approve or reject submitted articles."
            icon={<ClipboardList size={22} />}
          />

          <QuickActionCard
            href="/dashboard/users"
            title="Manage Users"
            description="Update roles and manage user accounts."
            icon={<Users size={22} />}
          />
        </>
      )}
    </section>
  );
}