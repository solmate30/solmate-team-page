import { db } from "@/db";
import { crewMembers } from "@/db/schema";
import { asc } from "drizzle-orm";
import { CrewAdmin } from "./CrewAdmin";

export const dynamic = "force-dynamic";

export default async function AdminCrewPage() {
  const members = await db
    .select()
    .from(crewMembers)
    .orderBy(asc(crewMembers.sortOrder), asc(crewMembers.createdAt));

  return <CrewAdmin initial={members} />;
}
