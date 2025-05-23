import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";

export default function ProjectsPage() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Proyectos / Obras</h2>
      <ProjectList />
      <ProjectDetail />
    </div>
  );
}
