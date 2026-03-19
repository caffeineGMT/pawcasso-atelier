/**
 * Email Authentication & Deliverability Checker
 *
 * Checks DNS records for email authentication:
 * - SPF (Sender Policy Framework)
 * - DKIM (DomainKeys Identified Mail)
 * - DMARC (Domain-based Message Authentication)
 * - MX (Mail Exchange) records
 *
 * These are critical for avoiding spam filters.
 */

import { promises as dns } from "dns";

const DOMAIN = "pawcasso-atelier.com";
const DKIM_SELECTOR = "resend"; // Resend's default DKIM selector

interface DNSCheckResult {
  record: string;
  type: string;
  exists: boolean;
  value?: string;
  status: "✅ PASS" | "❌ FAIL" | "⚠️  WARN";
  recommendation?: string;
}

async function checkSPF(): Promise<DNSCheckResult> {
  try {
    const records = await dns.resolveTxt(DOMAIN);
    const spfRecord = records.find((record) =>
      record.join("").startsWith("v=spf1")
    );

    if (spfRecord) {
      const spfValue = spfRecord.join("");

      // Check if Resend is authorized
      const hasResend =
        spfValue.includes("include:resend.com") ||
        spfValue.includes("include:_spf.resend.com");

      return {
        record: "SPF",
        type: "TXT",
        exists: true,
        value: spfValue,
        status: hasResend ? "✅ PASS" : "⚠️  WARN",
        recommendation: hasResend
          ? undefined
          : "Add 'include:resend.com' to your SPF record",
      };
    } else {
      return {
        record: "SPF",
        type: "TXT",
        exists: false,
        status: "❌ FAIL",
        recommendation: `Add TXT record: "v=spf1 include:resend.com ~all"`,
      };
    }
  } catch (error: any) {
    return {
      record: "SPF",
      type: "TXT",
      exists: false,
      status: "❌ FAIL",
      recommendation: `Add TXT record: "v=spf1 include:resend.com ~all"`,
    };
  }
}

async function checkDKIM(): Promise<DNSCheckResult> {
  const dkimDomain = `${DKIM_SELECTOR}._domainkey.${DOMAIN}`;

  try {
    const records = await dns.resolveTxt(dkimDomain);
    const dkimRecord = records.find((record) =>
      record.join("").includes("v=DKIM1")
    );

    if (dkimRecord) {
      return {
        record: `DKIM (${DKIM_SELECTOR})`,
        type: "TXT",
        exists: true,
        value: dkimRecord.join("").slice(0, 50) + "...",
        status: "✅ PASS",
      };
    } else {
      return {
        record: `DKIM (${DKIM_SELECTOR})`,
        type: "TXT",
        exists: false,
        status: "❌ FAIL",
        recommendation: "Contact Resend support for DKIM setup instructions",
      };
    }
  } catch (error: any) {
    return {
      record: `DKIM (${DKIM_SELECTOR})`,
      type: "TXT",
      exists: false,
      status: "❌ FAIL",
      recommendation:
        "Add DKIM record provided by Resend (check Resend dashboard)",
    };
  }
}

async function checkDMARC(): Promise<DNSCheckResult> {
  const dmarcDomain = `_dmarc.${DOMAIN}`;

  try {
    const records = await dns.resolveTxt(dmarcDomain);
    const dmarcRecord = records.find((record) =>
      record.join("").startsWith("v=DMARC1")
    );

    if (dmarcRecord) {
      const dmarcValue = dmarcRecord.join("");

      // Check policy strictness
      const hasStrictPolicy =
        dmarcValue.includes("p=quarantine") ||
        dmarcValue.includes("p=reject");

      return {
        record: "DMARC",
        type: "TXT",
        exists: true,
        value: dmarcValue,
        status: hasStrictPolicy ? "✅ PASS" : "⚠️  WARN",
        recommendation: hasStrictPolicy
          ? undefined
          : "Consider using 'p=quarantine' or 'p=reject' for better protection",
      };
    } else {
      return {
        record: "DMARC",
        type: "TXT",
        exists: false,
        status: "❌ FAIL",
        recommendation: `Add TXT record at _dmarc.${DOMAIN}: "v=DMARC1; p=quarantine; rua=mailto:dmarc@${DOMAIN}"`,
      };
    }
  } catch (error: any) {
    return {
      record: "DMARC",
      type: "TXT",
      exists: false,
      status: "❌ FAIL",
      recommendation: `Add TXT record at _dmarc.${DOMAIN}: "v=DMARC1; p=quarantine; rua=mailto:dmarc@${DOMAIN}"`,
    };
  }
}

async function checkMX(): Promise<DNSCheckResult> {
  try {
    const records = await dns.resolveMx(DOMAIN);

    if (records && records.length > 0) {
      const exchanges = records
        .sort((a, b) => a.priority - b.priority)
        .map((r) => `${r.exchange} (priority: ${r.priority})`)
        .join(", ");

      return {
        record: "MX",
        type: "MX",
        exists: true,
        value: exchanges,
        status: "✅ PASS",
      };
    } else {
      return {
        record: "MX",
        type: "MX",
        exists: false,
        status: "⚠️  WARN",
        recommendation:
          "MX records not required for sending-only domain, but recommended for receiving bounces",
      };
    }
  } catch (error: any) {
    return {
      record: "MX",
      type: "MX",
      exists: false,
      status: "⚠️  WARN",
      recommendation:
        "MX records not required for sending-only domain, but recommended for receiving bounces",
    };
  }
}

async function checkEmailAuthentication() {
  console.log("🔍 Checking Email Authentication for:", DOMAIN);
  console.log("=".repeat(70));

  const checks = await Promise.all([
    checkSPF(),
    checkDKIM(),
    checkDMARC(),
    checkMX(),
  ]);

  console.log("\n📋 DNS RECORDS");
  console.log("-".repeat(70));

  checks.forEach((check) => {
    console.log(`\n${check.status} ${check.record} (${check.type})`);
    if (check.exists && check.value) {
      console.log(`   Value: ${check.value}`);
    }
    if (check.recommendation) {
      console.log(`   ⚠️  ${check.recommendation}`);
    }
  });

  // Overall score
  const passCount = checks.filter((c) => c.status === "✅ PASS").length;
  const totalCount = checks.length;
  const score = (passCount / totalCount) * 100;

  console.log("\n\n📊 OVERALL SCORE");
  console.log("=".repeat(70));
  console.log(`${passCount}/${totalCount} checks passed (${score.toFixed(1)}%)`);

  if (score === 100) {
    console.log("\n✅ Excellent! All email authentication records are configured.");
  } else if (score >= 75) {
    console.log(
      "\n⚠️  Good, but some improvements recommended for optimal deliverability."
    );
  } else if (score >= 50) {
    console.log(
      "\n⚠️  Fair. Missing authentication may cause deliverability issues."
    );
  } else {
    console.log(
      "\n❌ Poor. Missing authentication will likely cause emails to go to spam."
    );
  }

  // Deliverability tips
  console.log("\n\n💡 DELIVERABILITY TIPS");
  console.log("=".repeat(70));
  console.log("1. SPF: Authorizes which servers can send email for your domain");
  console.log("2. DKIM: Cryptographically signs emails to prove authenticity");
  console.log("3. DMARC: Tells receivers what to do with unauthenticated emails");
  console.log("4. Warm up your domain: Start with low volume, gradually increase");
  console.log("5. Monitor bounce rates: Keep below 2%");
  console.log("6. Maintain clean list: Remove hard bounces immediately");
  console.log(
    "7. Engagement matters: High open/click rates improve reputation"
  );
  console.log("8. Avoid spam triggers: All caps, excessive exclamation marks");

  // Resend-specific instructions
  console.log("\n\n📧 RESEND SETUP INSTRUCTIONS");
  console.log("=".repeat(70));
  console.log("1. Log into Resend dashboard: https://resend.com/domains");
  console.log(`2. Add domain: ${DOMAIN}`);
  console.log("3. Copy DNS records provided by Resend");
  console.log("4. Add records to your DNS provider (Vercel, Cloudflare, etc.)");
  console.log("5. Wait for DNS propagation (up to 48 hours)");
  console.log("6. Verify domain in Resend dashboard");
  console.log("7. Re-run this script to confirm setup");

  console.log("\n");
}

// Run authentication check
checkEmailAuthentication().catch(console.error);
