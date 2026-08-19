import { NextResponse } from "next/server";
import { filterDebtorsByRole, getAuthContextFromRequest } from "@/lib/authorization";
import { getDebtorsState } from "@/lib/server-data";

export async function GET(request: Request) {
  const auth = getAuthContextFromRequest(request);
  const debtors = filterDebtorsByRole(auth, getDebtorsState());
  return NextResponse.json({ role: auth.role, apartmentId: auth.apartmentId, debtors });
}
