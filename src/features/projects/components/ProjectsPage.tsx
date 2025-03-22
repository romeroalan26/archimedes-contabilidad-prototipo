import { Routes, Route } from "react-router-dom";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";
import ProjectForm from "./ProjectForm";

export default function ProjectsPage() {
  return (
    <div className="p-6">
      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/nuevo" element={<ProjectForm mode="create" />} />
        <Route path="/:id" element={<ProjectDetail />} />
      </Routes>
    </div>
  );
}
