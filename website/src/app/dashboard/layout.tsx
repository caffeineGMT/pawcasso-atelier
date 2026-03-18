import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  return <>{children}</>;
}
