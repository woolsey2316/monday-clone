import { api } from "./client";
import type { AuthTokens, User } from "../types";

export async function register(payload: {
  username: string;
  email: string;
  password: string;
}): Promise<{ user: User } & AuthTokens> {
  const { data } = await api.post("/api/auth/register/", payload);
  return data;
}

export async function login(payload: {
  username: string;
  password: string;
}): Promise<AuthTokens> {
  const { data } = await api.post("/api/auth/token/", payload);
  return data;
}
