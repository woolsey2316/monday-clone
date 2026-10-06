export type User = {
  id: number;
  username: string;
  email: string;
};

export type CellValue = {
  id: number;
  column_id: number;
  value: Record<string, unknown>;
};

export type Item = {
  id: number;
  name: string;
  position: number;
  cells: CellValue[];
  created_at: string;
  updated_at: string;
};

export type Group = {
  id: number;
  title: string;
  color: string;
  position: number;
  items: Item[];
};

export type BoardColumn = {
  id: number;
  title: string;
  type: "status" | "text";
  position: number;
};

export type BoardSummary = {
  id: number;
  name: string;
  description: string;
  workspace: number;
  created_at: string;
  updated_at: string;
};

export type BoardDetail = BoardSummary & {
  columns: BoardColumn[];
  groups: Group[];
};

export type Workspace = {
  id: number;
  name: string;
  description: string;
  boards: BoardSummary[];
  created_at: string;
  updated_at: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};
