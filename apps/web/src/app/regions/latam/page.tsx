"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LatamRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/regions"); }, [router]);
  return null;
}
