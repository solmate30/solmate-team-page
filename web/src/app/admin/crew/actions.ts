"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { crewMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

function newId() {
  return crypto.randomUUID();
}

// 클라이언트가 Cloudinary에 직접 업로드할 수 있도록 서명만 발급
export async function getCloudinarySignature(): Promise<{
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary 환경변수가 설정되지 않았습니다.");
  }

  const folder = "solmate/crew";
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  return { signature, timestamp, apiKey, cloudName, folder };
}

export async function createCrewMember(data: {
  nickname: string;
  name: string;
  career1: string;
  career2: string;
  photoUrl: string;
  sortOrder: number;
}) {
  await db.insert(crewMembers).values({
    id: newId(),
    ...data,
    createdAt: new Date(),
  });
  revalidatePath("/admin/crew");
  revalidatePath("/");
}

export async function updateCrewMember(
  id: string,
  data: {
    nickname: string;
    name: string;
    career1: string;
    career2: string;
    photoUrl: string;
    sortOrder: number;
  }
) {
  await db.update(crewMembers).set(data).where(eq(crewMembers.id, id));
  revalidatePath("/admin/crew");
  revalidatePath("/");
}

export async function deleteCrewMember(id: string) {
  await db.delete(crewMembers).where(eq(crewMembers.id, id));
  revalidatePath("/admin/crew");
  revalidatePath("/");
}
