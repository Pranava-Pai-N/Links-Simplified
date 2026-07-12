"use client";

import { useParams } from "next/navigation";

function LinkAnalytics() {
  const { id } = useParams();
  return <div>page of {id}</div>;
}

export default LinkAnalytics;
