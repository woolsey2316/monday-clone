import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { HomePage } from "./pages/HomePage";
import { BoardPage } from "./pages/BoardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import * as boardsApi from "./api/boards";
import type { Workspace } from "./types";

function BoardRoute() {
  const { boardId } = useParams();
  const id = Number(boardId);
  if (!id) return <Navigate to="/" replace />;
  return <BoardPage boardId={id} />;
}

function AuthenticatedApp() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const refresh = useCallback(async () => {
    const data = await boardsApi.listWorkspaces();
    setWorkspaces(data);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleCreateWorkspace() {
    const name = window.prompt("Workspace name");
    if (!name?.trim()) return;
    await boardsApi.createWorkspace({ name: name.trim() });
    await refresh();
  }

  async function handleCreateBoard(workspaceId: number) {
    const name = window.prompt("Board name");
    if (!name?.trim()) return;
    await boardsApi.createBoard(workspaceId, { name: name.trim() });
    await refresh();
  }

  return (
    <Routes>
      <Route
        element={
          <AppShell
            workspaces={workspaces}
            onCreateWorkspace={() => void handleCreateWorkspace()}
            onCreateBoard={(id) => void handleCreateBoard(id)}
          />
        }
      >
        <Route index element={<HomePage />} />
        <Route path="boards/:boardId" element={<BoardRoute />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<AuthenticatedApp />} />
      </Route>
    </Routes>
  );
}
