import type { Metadata } from "next";
import { hiringRobots } from "@/lib/hiring";

// The application form is a client component, so it cannot export metadata of
// its own. This layout exists to carry the robots tag: while we are not hiring
// the form should not be a search result, even though it stays reachable by
// direct link for anyone we invited ourselves.
export const metadata: Metadata = {
  title: "Apply to clean with CLEENLY",
  robots: hiringRobots,
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
