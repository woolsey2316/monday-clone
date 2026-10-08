import { useEffect, useState } from "react";
import type { BoardColumn, BoardDetail, Item } from "../types";
import * as boardsApi from "../api/boards";

const STATUS_OPTIONS = [
  { label: "", color: "#c4c4c4" },
  { label: "Working on it", color: "#fdab3d" },
  { label: "Done", color: "#00c875" },
  { label: "Stuck", color: "#e2445c" },
];

const GROUP_COLORS = [
  "#579bfc",
  "#66ccff",
  "#00d2d2",
  "#00c875",
  "#9cd326",
  "#cab641",
  "#ffcb00",
  "#fdab3d",
  "#ff642e",
  "#e2445c",
  "#ff158a",
  "#ff5ac4",
  "#a25ddc",
  "#784bd1",
  "#037f4c",
  "#bb3354",
  "#7f5347",
  "#c4c4c4",
];

type BoardPageProps = {
  boardId: number;
  onBoardChanged?: () => void;
};

function cellValueFor(item: Item, columnId: number) {
  return item.cells.find((c) => c.column_id === columnId)?.value ?? {};
}

type TimelineEdit = {
  itemId: number;
  column: BoardColumn;
  start: string;
  end: string;
};

function formatTimelineLabel(start: string, end: string) {
  if (!start && !end) return null;
  const fmt = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  if (start) return `From ${fmt(start)}`;
  return `Until ${fmt(end)}`;
}

export function BoardPage({ boardId }: BoardPageProps) {
  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [colorPickerGroupId, setColorPickerGroupId] = useState<number | null>(null);
  const [timelineEdit, setTimelineEdit] = useState<TimelineEdit | null>(null);

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

  async function renameGroup(groupId: number, title: string) {
    await boardsApi.updateGroup(groupId, { title });
    await load();
  }

  async function changeGroupColor(groupId: number, color: string) {
    setColorPickerGroupId(null);
    await boardsApi.updateGroup(groupId, { color });
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

  async function saveTimeline(edit: TimelineEdit) {
    let { start, end } = edit;
    if (start && end && start > end) {
      [start, end] = [end, start];
    }
    setTimelineEdit(null);
    await updateCell(edit.itemId, edit.column, { start, end });
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
              <button
                type="button"
                className="inline-block h-3.5 w-3.5 shrink-0 rounded-sm outline-none ring-offset-1 hover:ring-2 hover:ring-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{ background: group.color }}
                title="Change group color"
                aria-label={`Change color for ${group.title}`}
                onClick={() => setColorPickerGroupId(group.id)}
              />
              <input
                className="bg-transparent text-base font-semibold outline-none"
                style={{ color: group.color }}
                defaultValue={group.title}
                key={`${group.id}-${group.title}`}
                onBlur={(e) => {
                  const next = e.target.value.trim();
                  if (!next || next === group.title) {
                    e.target.value = group.title;
                    return;
                  }
                  void renameGroup(group.id, next);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
              />
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
                      <th
                        key={col.id}
                        className={`px-3 py-2 font-medium ${
                          col.type === "timeline" ? "w-56" : "w-48"
                        }`}
                      >
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
                        if (col.type === "timeline") {
                          const start = String(value.start ?? "");
                          const end = String(value.end ?? "");
                          const label = formatTimelineLabel(start, end);
                          return (
                            <td key={col.id} className="px-2 py-1">
                              <button
                                type="button"
                                className={`w-full rounded px-2 py-1.5 text-center text-xs font-medium outline-none ${
                                  label
                                    ? "bg-[#e5f4ff] text-[var(--accent)] hover:bg-[#d0ebff]"
                                    : "bg-[#f5f6f8] text-[var(--muted)] hover:bg-[#ebedf0]"
                                }`}
                                onClick={() =>
                                  setTimelineEdit({
                                    itemId: item.id,
                                    column: col,
                                    start,
                                    end,
                                  })
                                }
                              >
                                {label ?? "Set dates"}
                              </button>
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

      {colorPickerGroupId !== null && (
        <GroupColorModal
          currentColor={
            board.groups.find((g) => g.id === colorPickerGroupId)?.color ??
            GROUP_COLORS[0]
          }
          onSelect={(color) => void changeGroupColor(colorPickerGroupId, color)}
          onClose={() => setColorPickerGroupId(null)}
        />
      )}

      {timelineEdit && (
        <TimelineModal
          start={timelineEdit.start}
          end={timelineEdit.end}
          onChange={(patch) =>
            setTimelineEdit((prev) => (prev ? { ...prev, ...patch } : prev))
          }
          onSave={() => void saveTimeline(timelineEdit)}
          onClear={() =>
            void saveTimeline({ ...timelineEdit, start: "", end: "" })
          }
          onClose={() => setTimelineEdit(null)}
        />
      )}
    </div>
  );
}

function useEscapeKey(onClose: () => void) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
}

function GroupColorModal({
  currentColor,
  onSelect,
  onClose,
}: {
  currentColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}) {
  useEscapeKey(onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-xs rounded-lg bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Choose group color"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text)]">Group color</h3>
          <button
            type="button"
            className="text-lg leading-none text-[var(--muted)] hover:text-[var(--text)]"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {GROUP_COLORS.map((color) => {
            const selected = color.toLowerCase() === currentColor.toLowerCase();
            return (
              <button
                key={color}
                type="button"
                className={`h-8 w-8 rounded-md outline-none transition ${
                  selected
                    ? "ring-2 ring-[var(--accent)] ring-offset-2"
                    : "hover:scale-105"
                }`}
                style={{ background: color }}
                title={color}
                aria-label={`Select color ${color}`}
                aria-pressed={selected}
                onClick={() => onSelect(color)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TimelineModal({
  start,
  end,
  onChange,
  onSave,
  onClear,
  onClose,
}: {
  start: string;
  end: string;
  onChange: (patch: { start?: string; end?: string }) => void;
  onSave: () => void;
  onClear: () => void;
  onClose: () => void;
}) {
  useEscapeKey(onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Set timeline dates"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text)]">Timeline</h3>
          <button
            type="button"
            className="text-lg leading-none text-[var(--muted)] hover:text-[var(--text)]"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--muted)]">Start date</span>
            <input
              type="date"
              className="w-full rounded border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
              value={start}
              onChange={(e) => onChange({ start: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--muted)]">End date</span>
            <input
              type="date"
              className="w-full rounded border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
              value={end}
              min={start || undefined}
              onChange={(e) => onChange({ end: e.target.value })}
            />
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            className="text-sm text-[var(--muted)] hover:text-red-600"
            onClick={onClear}
          >
            Clear
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded px-3 py-1.5 text-sm text-[var(--muted)] hover:bg-[#f5f6f8]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0060b9]"
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
