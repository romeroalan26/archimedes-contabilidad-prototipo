import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Proyectos / Obras</h2>
      <ProjectList />
      <ProjectDetail />
    </div>
  );
}
