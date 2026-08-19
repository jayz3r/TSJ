import { NextResponse } from "next/server";
import { filterRequestsByRole, getAuthContextFromRequest } from "@/lib/authorization";
import {
  addRequestState,
  getApartmentById,
  getApartmentByNumber,
  getRequestsState,
  updateRequestState,
} from "@/lib/server-data";
import type { Request, RequestStatus } from "@/types";

interface CreateRequestBody {
  apartmentId?: string;
  apartmentNumber?: number;
  subject?: string;
  date?: string;
}

interface UpdateRequestBody {
  id?: string;
  status?: RequestStatus;
  assignee?: string;
}

function nextRequestId(): string {
  const maxId = getRequestsState().reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
  return String(maxId + 1).padStart(3, "0");
}

export async function GET(request: Request) {
  const auth = getAuthContextFromRequest(request);
  const requests = filterRequestsByRole(auth, getRequestsState());
  return NextResponse.json({ role: auth.role, apartmentId: auth.apartmentId, requests });
}

export async function POST(request: Request) {
  const auth = getAuthContextFromRequest(request);
  const body = (await request.json()) as CreateRequestBody;

  if (!body.subject) {
    return NextResponse.json({ message: "Тема заявки обязательна" }, { status: 400 });
  }

  let apartmentId: string | null = null;

  if (auth.role === "admin") {
    if (body.apartmentId) {
      apartmentId = body.apartmentId;
    } else if (body.apartmentNumber) {
      apartmentId = getApartmentByNumber(Number(body.apartmentNumber))?.id ?? null;
    }
  } else {
    apartmentId = auth.apartmentId;
  }

  if (!apartmentId) {
    return NextResponse.json({ message: "Не определена квартира для заявки" }, { status: 400 });
  }

  const apartment = getApartmentById(apartmentId);
  if (!apartment) {
    return NextResponse.json({ message: "Квартира не найдена" }, { status: 404 });
  }

  const nextRequest: Request = {
    id: nextRequestId(),
    apartmentId: apartment.id,
    apartmentNumber: apartment.number,
    subject: body.subject,
    date: body.date ?? new Date().toISOString().split("T")[0],
    status: "new",
    createdByRole: auth.role,
  };

  addRequestState(nextRequest);
  const visibleRequests = filterRequestsByRole(auth, getRequestsState());
  return NextResponse.json({ request: nextRequest, requests: visibleRequests }, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = getAuthContextFromRequest(request);
  if (auth.role !== "admin") {
    return NextResponse.json({ message: "Только администратор может менять статус" }, { status: 403 });
  }

  const body = (await request.json()) as UpdateRequestBody;
  if (!body.id || !body.status) {
    return NextResponse.json({ message: "Некорректные данные обновления" }, { status: 400 });
  }

  const updated = updateRequestState(body.id, { status: body.status, assignee: body.assignee });
  if (!updated) {
    return NextResponse.json({ message: "Заявка не найдена" }, { status: 404 });
  }

  return NextResponse.json({ request: updated, requests: getRequestsState() });
}
