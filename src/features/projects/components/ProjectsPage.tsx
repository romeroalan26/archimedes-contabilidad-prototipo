import { Routes, Route } from "react-router-dom";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";
import ProjectForm from "./ProjectForm";

export default function ProjectsPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Proyectos / Obras</h1>
      <Routes>
        <Route index element={<ProjectList />} />
        <Route path="nuevo" element={<ProjectForm mode="create" />} />
        <Route path=":id" element={<ProjectDetail />} />
      </Routes>
    </div>
  );
}

