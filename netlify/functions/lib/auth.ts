import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { HandlerEvent } from "@netlify/functions";
import { sql } from "./db";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is required");
  return secret;
}

export function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function parseCookies(event: HandlerEvent): Record<string, string> {
  const cookieHeader = event.headers.cookie || event.headers.Cookie || "";
  return cookieHeader
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, entry) => {
      const [key, ...rest] = entry.split("=");
      acc[key] = decodeURIComponent(rest.join("="));
      return acc;
    }, {});
}

export function createSessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(
    token
  )}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}; Secure`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
}

async function ensureBootstrapAdmin() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!bootstrapPassword) return;

  const existing = await sql`select id from admins where username = ${username} limit 1`;
  if (existing.length > 0) return;

  const passwordHash = await bcrypt.hash(bootstrapPassword, 12);
  await sql`
    insert into admins (username, password_hash)
    values (${username}, ${passwordHash})
  `;
}

export async function loginAdmin(username: string, password: string) {
  await ensureBootstrapAdmin();
  const rows = await sql<
    { id: string; username: string; password_hash: string }[]
  >`select id, username, password_hash from admins where username = ${username} limit 1`;
  const admin = rows[0];
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) return null;

  const token = jwt.sign({ adminId: admin.id }, getSessionSecret(), {
    expiresIn: SESSION_TTL_SECONDS,
  });

  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  await sql`
    insert into sessions (admin_id, token_hash, expires_at)
    values (${admin.id}, ${hashToken(token)}, ${expiresAt.toISOString()})
  `;

  return { token, admin: { id: admin.id, username: admin.username } };
}

export async function getSessionAdmin(event: HandlerEvent) {
  const cookies = parseCookies(event);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;

  try {
    jwt.verify(token, getSessionSecret());
  } catch {
    return null;
  }

  const tokenHash = hashToken(token);
  const rows = await sql<{ id: string; username: string }[]>`
    select a.id, a.username
    from sessions s
    join admins a on a.id = s.admin_id
    where s.token_hash = ${tokenHash} and s.expires_at > now()
    limit 1
  `;
  return rows[0] || null;
}

export async function destroySession(event: HandlerEvent) {
  const cookies = parseCookies(event);
  const token = cookies[SESSION_COOKIE];
  if (!token) return;
  await sql`delete from sessions where token_hash = ${hashToken(token)}`;
}
