import { useEffect, useState } from "react";
import type { BoardColumn, BoardDetail, Item } from "../types";
import * as boardsApi from "../api/boards";

const STATUS_OPTIONS = [
  { label: "", color: "#c4c4c4" },
  { label: "Working on it", color: "#fdab3d" },
  { label: "Done", color: "#00c875" },
  { label: "Stuck", color: "#e2445c" },
];

type BoardPageProps = {
  boardId: number;
  onBoardChanged?: () => void;
};

function cellValueFor(item: Item, columnId: number) {
  return item.cells.find((c) => c.column_id === columnId)?.value ?? {};
}

export function BoardPage({ boardId }: BoardPageProps) {
  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await boardsApi.getBoard(boardId);
      setBoard(data);
    } catch {
      setError("Failed to load board");
      setBoard(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [boardId]);

  async function addGroup() {
    if (!board) return;
    await boardsApi.createGroup(board.id, { title: "New Group" });
    await load();
  }

  async function addItem(groupId: number) {
    await boardsApi.createItem(groupId, { name: "New Item" });
    await load();
  }

  async function renameItem(itemId: number, name: string) {
    await boardsApi.updateItem(itemId, { name });
    await load();
  }

  async function removeItem(itemId: number) {
    await boardsApi.deleteItem(itemId);
    await load();
  }

  async function updateCell(
    itemId: number,
    column: BoardColumn,
    value: Record<string, unknown>,
  ) {
    await boardsApi.upsertCell(itemId, column.id, value);
    await load();
  }

  if (loading) {
    return <div className="p-8 text-[var(--muted)]">Loading board...</div>;
  }
  if (error || !board) {
    return <div className="p-8 text-red-600">{error || "Board not found"}</div>;
  }

  return (
    <div className="min-h-full bg-[var(--bg)]">
      <header className="border-b border-[var(--border)] bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-[var(--sidebar)]">{board.name}</h1>
        {board.description && (
          <p className="mt-1 text-sm text-[var(--muted)]">{board.description}</p>
        )}
      </header>

      <div className="space-y-6 p-6">
        {board.groups.map((group) => (
          <section key={group.id}>
            <div className="mb-2 flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ background: group.color }}
              />
              <h2 className="text-base font-semibold" style={{ color: group.color }}>
                {group.title}
              </h2>
              <span className="text-xs text-[var(--muted)]">
                {group.items.length} items
              </span>
            </div>

            <div className="overflow-x-auto rounded border border-[var(--border)] bg-white">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[#f5f6f8] text-left text-xs uppercase tracking-wide text-[var(--muted)]">
                    <th className="w-8 px-2 py-2" />
                    <th className="px-3 py-2 font-medium">Item</th>
                    {board.columns.map((col) => (
                      <th key={col.id} className="w-48 px-3 py-2 font-medium">
                        {col.title}
                      </th>
                    ))}
                    <th className="w-16 px-2 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[var(--border)] last:border-b-0 hover:bg-[#fafbfc]"
                    >
                      <td
                        className="px-2"
                        style={{ borderLeft: `4px solid ${group.color}` }}
                      />
                      <td className="px-3 py-1.5">
                        <input
                          className="w-full bg-transparent outline-none"
                          defaultValue={item.name}
                          onBlur={(e) => {
                            if (e.target.value !== item.name) {
                              void renameItem(item.id, e.target.value);
                            }
                          }}
                        />
                      </td>
                      {board.columns.map((col) => {
                        const value = cellValueFor(item, col.id);
                        if (col.type === "status") {
                          const label = String(value.label ?? "");
                          const color = String(
                            value.color ??
                              STATUS_OPTIONS.find((o) => o.label === label)?.color ??
                              "#c4c4c4",
                          );
                          return (
                            <td key={col.id} className="px-2 py-1">
                              <select
                                className="w-full cursor-pointer rounded border-0 px-2 py-1.5 text-center text-xs font-medium text-white outline-none"
                                style={{ background: color }}
                                value={label}
                                onChange={(e) => {
                                  const opt =
                                    STATUS_OPTIONS.find(
                                      (o) => o.label === e.target.value,
                                    ) || STATUS_OPTIONS[0];
                                  void updateCell(item.id, col, {
                                    label: opt.label,
                                    color: opt.color,
                                  });
                                }}
                              >
                                {STATUS_OPTIONS.map((opt) => (
                                  <option key={opt.label || "empty"} value={opt.label}>
                                    {opt.label || "—"}
                                  </option>
                                ))}
                              </select>
                            </td>
                          );
                        }
                        return (
                          <td key={col.id} className="px-3 py-1.5">
                            <input
                              className="w-full bg-transparent outline-none"
                              defaultValue={String(value.text ?? "")}
                              placeholder="—"
                              onBlur={(e) => {
                                if (e.target.value !== String(value.text ?? "")) {
                                  void updateCell(item.id, col, {
                                    text: e.target.value,
                                  });
                                }
                              }}
                            />
                          </td>
                        );
                      })}
                      <td className="px-2 text-center">
                        <button
                          type="button"
                          className="text-[var(--muted)] hover:text-red-600"
                          onClick={() => void removeItem(item.id)}
                          title="Delete item"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={() => void addItem(group.id)}
                className="w-full border-t border-[var(--border)] px-4 py-2 text-left text-sm text-[var(--muted)] hover:bg-[#f5f6f8] hover:text-[var(--accent)]"
              >
                + Add item
              </button>
            </div>
          </section>
        ))}

        <button
          type="button"
          onClick={() => void addGroup()}
          className="rounded border border-dashed border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          + Add new group
        </button>
      </div>
    </div>
  );
}
