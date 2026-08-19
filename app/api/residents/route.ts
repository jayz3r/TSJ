import { NextResponse } from "next/server";
import {
  canAccessApartment,
  filterApartmentsByRole,
  filterPaymentsByRole,
  getAuthContextFromRequest,
} from "@/lib/authorization";
import {
  getAccrualsState,
  getApartmentById,
  getApartmentsState,
  getPaymentsState,
} from "@/lib/server-data";

export async function GET(request: Request) {
  const auth = getAuthContextFromRequest(request);
  const { searchParams } = new URL(request.url);
  const residentId = searchParams.get("id");

  if (residentId) {
    const apartment = getApartmentById(residentId);
    if (!apartment) {
      return NextResponse.json({ message: "Квартира не найдена" }, { status: 404 });
    }
    if (!canAccessApartment(auth, apartment.id)) {
      return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
    }

    const payments = filterPaymentsByRole(auth, getPaymentsState()).filter(
      (payment) => payment.apartmentId === apartment.id,
    );

    return NextResponse.json({
      role: auth.role,
      apartmentId: auth.apartmentId,
      apartment,
      payments,
      accruals: getAccrualsState(),
    });
  }

  const apartments = filterApartmentsByRole(auth, getApartmentsState());
  return NextResponse.json({
    role: auth.role,
    apartmentId: auth.apartmentId,
    apartments,
  });
}
