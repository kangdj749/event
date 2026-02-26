import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getSheetsClient } from "@/lib/google-sheet-client";

export const runtime = "nodejs";

const SHEET_ID = process.env.GOOGLE_SHEET_ID_LP!;
const RANGE = "registrations!A:L";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      birthPlace,
      birthDate,
      school,
      grade,
      city,
      studentCardUrl,
      competitions,
      tourGallery,
    } = body;

    if (!fullName)
      return NextResponse.json(
        { error: "Nama wajib diisi" },
        { status: 400 }
      );

    if (!studentCardUrl)
      return NextResponse.json(
        { error: "Kartu pelajar wajib upload" },
        { status: 400 }
      );

    if (!competitions || competitions.length === 0)
      return NextResponse.json(
        { error: "Minimal pilih 1 lomba" },
        { status: 400 }
      );

    const id = nanoid(10);
    const createdAt = new Date().toISOString();

    const row = [
      id,
      createdAt,
      fullName,
      birthPlace || "",
      birthDate ? new Date(birthDate).toISOString() : "",
      school || "",
      grade || "",
      city || "",
      studentCardUrl,
      JSON.stringify(competitions),
      tourGallery ? "Ya" : "Tidak",
      "pending",
    ];

    const sheets = getSheetsClient();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID_LP!,
      range: "registrations!A:L",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json(
      { error: "Gagal simpan pendaftaran" },
      { status: 500 }
    );
  }
}