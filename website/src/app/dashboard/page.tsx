import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderCard from "@/app/dashboard/components/OrderCard";
import Sidebar from "@/app/dashboard/components/Sidebar";
import ReferralSection from "@/app/dashboard/components/ReferralSection";

export const dynamic = "force-dynamic";

async function getOrders(email: string) {
  return await prisma.order.findMany({
    where: { customerEmail: email },
    orderBy: { createdAt: "desc" },
  });
}

async function getCustomer(email: string) {
  return await prisma.customer.findUnique({
    where: { email },
    include: {
      referralsGiven: {
        where: { status: "converted" },
      },
    },
  });
}

export default async function DashboardPage() {
  const session = await requireAuth();
  const email = session.user!.email!;

  const [orders, customer] = await Promise.all([
    getOrders(email),
    getCustomer(email),
  ]);

  const totalOrders = orders.length;
  const totalSpent = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <Sidebar
          userName={session.user!.name || session.user!.email!}
          userEmail={email}
          activeSection="orders"
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-60">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-[#E5E5E5] px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#E07A5F" }}>
                Pawcasso
              </h1>
              <button className="text-[#4A4A4A] text-sm font-medium">
                Menu
              </button>
            </div>
          </div>

          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-semibold text-[#2B2D42] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Welcome back, {session.user!.name || "there"}!
              </h1>
              <p className="text-[#4A4A4A]">
                Manage your orders, track deliveries, and earn referral credits.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="text-sm text-[#4A4A4A] mb-1">Total Orders</div>
                <div className="text-3xl font-bold text-[#E07A5F]">{totalOrders}</div>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="text-sm text-[#4A4A4A] mb-1">Total Spent</div>
                <div className="text-3xl font-bold text-[#E07A5F]">${totalSpent.toFixed(2)}</div>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="text-sm text-[#4A4A4A] mb-1">Credit Balance</div>
                <div className="text-3xl font-bold text-[#06D6A0]">
                  ${customer?.creditBalance?.toFixed(2) || "0.00"}
                </div>
              </div>
            </div>

            {/* Referral Section */}
            {customer && (
              <ReferralSection
                referralCode={customer.referralCode}
                totalReferrals={customer.totalReferrals}
                referrals={customer.referralsGiven}
                creditBalance={customer.creditBalance}
              />
            )}

            {/* Orders Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#2B2D42] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Your Orders
              </h2>

              {orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#E5E5E5] p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#E5E5E5] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#4A4A4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#2B2D42] mb-2">No orders yet</h3>
                  <p className="text-[#4A4A4A] mb-6">
                    Create your first AI pet portrait and see it here!
                  </p>
                  <a
                    href="/order"
                    className="inline-block bg-[#E07A5F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#E07A5F]/90 transition-colors"
                  >
                    Create Portrait
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
