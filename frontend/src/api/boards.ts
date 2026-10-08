import { api } from "./client";
import type { BoardDetail, BoardSummary, CellValue, Group, Item, Workspace } from "../types";

export async function listWorkspaces(): Promise<Workspace[]> {
  const { data } = await api.get("/api/workspaces/");
  return data;
}

export async function createWorkspace(payload: {
  name: string;
  description?: string;
}): Promise<Workspace> {
  const { data } = await api.post("/api/workspaces/", payload);
  return data;
}

export async function createBoard(
  workspaceId: number,
  payload: { name: string; description?: string },
): Promise<BoardSummary> {
  const { data } = await api.post(`/api/workspaces/${workspaceId}/boards/`, payload);
  return data;
}

export async function getBoard(boardId: number): Promise<BoardDetail> {
  const { data } = await api.get(`/api/boards/${boardId}/`);
  return data;
}

export async function createGroup(
  boardId: number,
  payload: { title?: string; color?: string } = {},
): Promise<Group> {
  const { data } = await api.post(`/api/boards/${boardId}/groups/`, payload);
  return data;
}

export async function updateGroup(
  groupId: number,
  payload: { title?: string; color?: string },
): Promise<Group> {
  const { data } = await api.patch(`/api/groups/${groupId}/`, payload);
  return data;
}

export async function createItem(
  groupId: number,
  payload: { name?: string } = {},
): Promise<Item> {
  const { data } = await api.post(`/api/groups/${groupId}/items/`, payload);
  return data;
}

export async function updateItem(
  itemId: number,
  payload: { name?: string },
): Promise<Item> {
  const { data } = await api.patch(`/api/items/${itemId}/`, payload);
  return data;
}

export async function deleteItem(itemId: number): Promise<void> {
  await api.delete(`/api/items/${itemId}/`);
}

export async function upsertCell(
  itemId: number,
  columnId: number,
  value: Record<string, unknown>,
): Promise<CellValue> {
  const { data } = await api.patch(`/api/items/${itemId}/cells/${columnId}/`, {
    value,
  });
  return data;
}
