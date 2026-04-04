import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUid } from "@/lib/firebase/auth";
import { createExpense } from "@/server/repositories/expenses-repository";

const expenseSchema = z.object({
  category: z.enum(["moradia", "transporte", "alimentacao", "saude", "educacao", "lazer", "outros"]),
  amount: z.number().positive(),
  recurring: z.boolean(),
  competenceDate: z.string().min(7)
});

export async function POST(request: NextRequest) {
  let uid: string;

  try {
    uid = await getSessionUid();
  } catch (error) {
    console.error("[api/expenses] erro de autenticação ao criar despesa", error);
    return NextResponse.json(
      { ok: false, error: "Não autenticado." },
      { status: 401 }
    );
  }

  let payload: z.infer<typeof expenseSchema>;

  try {
    payload = expenseSchema.parse(await request.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Payload inválido.", details: error.flatten() },
        { status: 400 }
      );
    }

    console.error("[api/expenses] erro ao processar payload da despesa", error);
    return NextResponse.json(
      { ok: false, error: "Não foi possível processar a requisição." },
      { status: 400 }
    );
  }

  try {
    const expense = await createExpense(uid, payload);
    return NextResponse.json({ ok: true, expense });
  } catch (error) {
    console.error("[api/expenses] erro interno ao criar despesa", error);
    return NextResponse.json(
      { ok: false, error: "Não foi possível criar a despesa." },
      { status: 500 }
    );
  }
}
