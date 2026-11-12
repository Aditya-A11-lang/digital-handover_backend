import { useMemo, useState } from 'react'
import { FolderKanban, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard.jsx'
import { getProjects } from '../services/api.js'

const filters = ['All projects', 'In progress', 'Planning', 'Review', 'Completed']

export default function Projects() {
  const projects = useMemo(() => getProjects(), [])
  const [filter, setFilter] = useState('All projects')
  const [params] = useSearchParams()
  const [search, setSearch] = useState(params.get('search') || '')
  const filtered = projects.filter((project) => {
    const matchesStatus = filter === 'All projects' || project.status === filter
    const text = `${project.name} ${project.client} ${project.description}`.toLowerCase()
    return matchesStatus && text.includes(search.toLowerCase().trim())
  })

  return (
    <div className="page-wrap">
      <div className="page-toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Filter projects">{filters.map((item) => <button key={item} type="button" className={`filter-tab${filter === item ? ' selected' : ''}`} onClick={() => setFilter(item)}>{item}{item === 'All projects' && <span>{projects.length}</span>}</button>)}</div>
        <Link className="button button-primary" to="/projects/new"><Plus size={16} /> New project</Link>
      </div>
      <div className="list-toolbar"><span>{filtered.length} {filtered.length === 1 ? 'project' : 'projects'}</span><label className="search-box project-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects" aria-label="Search projects" /></label><button className="button button-quiet" type="button" onClick={() => { setFilter('All projects'); setSearch('') }}><SlidersHorizontal size={15} /> Reset filters</button></div>
      {filtered.length ? <div className="project-grid">{filtered.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <div className="empty-state"><span className="empty-state-icon"><FolderKanban size={24} /></span><h2>No projects found</h2><p>Try a different search or create a project to get started.</p><Link className="button button-primary" to="/projects/new"><Plus size={16} /> Create a project</Link></div>}
    </div>
  )
}