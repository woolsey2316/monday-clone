import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Workspace } from "../types";

type AppShellProps = {
  workspaces: Workspace[];
  onCreateWorkspace: () => void;
  onCreateBoard: (workspaceId: number) => void;
};

export function AppShell({
  workspaces,
  onCreateWorkspace,
  onCreateBoard,
}: AppShellProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-full min-h-0">
      <aside className="flex w-64 shrink-0 flex-col bg-[var(--sidebar)] text-white">
        <div className="border-b border-white/10 px-4 py-4">
          <div className="text-lg font-semibold tracking-tight">monday clone</div>
          <div className="mt-1 truncate text-xs text-white/60">
            {user?.username || "User"}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/50">
              Workspaces
            </span>
            <button
              type="button"
              onClick={onCreateWorkspace}
              className="rounded px-1.5 text-sm text-white/70 hover:bg-[var(--sidebar-hover)] hover:text-white"
              title="New workspace"
            >
              +
            </button>
          </div>
          {workspaces.map((ws) => (
            <div key={ws.id} className="mb-3">
              <div className="flex items-center justify-between px-2 py-1 text-sm font-medium text-white/90">
                <span className="truncate">{ws.name}</span>
                <button
                  type="button"
                  onClick={() => onCreateBoard(ws.id)}
                  className="rounded px-1 text-white/50 hover:bg-[var(--sidebar-hover)] hover:text-white"
                  title="New board"
                >
                  +
                </button>
              </div>
              <div className="mt-0.5 space-y-0.5">
                {ws.boards.map((board) => (
                  <NavLink
                    key={board.id}
                    to={`/boards/${board.id}`}
                    className={({ isActive }) =>
                      `block truncate rounded px-3 py-1.5 text-sm ${
                        isActive
                          ? "bg-[var(--accent)] text-white"
                          : "text-white/70 hover:bg-[var(--sidebar-hover)] hover:text-white"
                      }`
                    }
                  >
                    {board.name}
                  </NavLink>
                ))}
                {ws.boards.length === 0 && (
                  <p className="px-3 py-1 text-xs text-white/40">No boards yet</p>
                )}
              </div>
            </div>
          ))}
          {workspaces.length === 0 && (
            <p className="px-2 text-xs text-white/40">
              Create a workspace to get started.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="border-t border-white/10 px-4 py-3 text-left text-sm text-white/70 hover:bg-[var(--sidebar-hover)] hover:text-white"
        >
          Log out
        </button>
      </aside>
      <main className="min-w-0 flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
