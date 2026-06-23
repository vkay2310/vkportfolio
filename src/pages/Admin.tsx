import { useState } from 'react';
import { Button } from '../components/ui/Button';
import initialData from '../data/data.json';
import { Copy, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function Admin() {
  const [data, setData] = useState<any>(initialData);
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const updateField = (section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateSocial = (field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      siteConfig: {
        ...prev.siteConfig,
        social: { ...prev.siteConfig.social, [field]: value }
      }
    }));
  };

  const updateProject = (idx: number, field: string, value: any) => {
    const newProjects = [...data.projects];
    newProjects[idx] = { ...newProjects[idx], [field]: value };
    setData((prev: any) => ({ ...prev, projects: newProjects }));
  };

  const addProject = () => {
    setData((prev: any) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: Date.now().toString(), title: "New Project", category: "Category", description: "", thumbnailUrl: "", tiktokUrl: "", featured: false }
      ]
    }));
  };

  const removeProject = (idx: number) => {
    const newProjects = [...data.projects];
    newProjects.splice(idx, 1);
    setData((prev: any) => ({ ...prev, projects: newProjects }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative pb-32">
      {/* Header Sticky */}
      <header className="sticky top-0 bg-background/90 backdrop-blur-md border-b border-border z-50 py-4 px-6 md:px-12 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-accent">Vo Khoi / Dashboard</h1>
          <p className="text-muted-foreground font-mono text-xs">Local JSON Editing Mode</p>
        </div>
        <Button variant="primary" onClick={handleExport} className="gap-2">
          {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
          {copied ? "COPIED TO CLIPBOARD" : "EXPORT JSON"}
        </Button>
      </header>

      <main className="container mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 font-mono">
        
        {/* Left Column: Basic Info */}
        <div className="flex flex-col gap-8">
          
          {/* Site Config */}
          <section className="bg-card p-6 border border-border">
            <h2 className="text-xl text-accent uppercase mb-6 tracking-widest border-b border-border pb-2">1. Trình Bày Chung (Site)</h2>
            <div className="flex flex-col gap-4">
              <label>
                <span className="block text-xs text-muted-foreground mb-1">Subtitle</span>
                <input className="w-full bg-background border border-border p-2 outline-none focus:border-accent" value={data.siteConfig.subtitle} onChange={e => updateField('siteConfig', 'subtitle', e.target.value)} />
              </label>
              <label>
                <span className="block text-xs text-muted-foreground mb-1">Description</span>
                <textarea className="w-full bg-background border border-border p-2 outline-none focus:border-accent h-24" value={data.siteConfig.description} onChange={e => updateField('siteConfig', 'description', e.target.value)} />
              </label>
              
              <h3 className="text-sm mt-4 mb-2 text-foreground/80">Social Links</h3>
              <label>
                <span className="block text-xs text-muted-foreground mb-1">Instagram URL</span>
                <input className="w-full bg-background border border-border p-2 outline-none focus:border-accent" value={data.siteConfig.social.instagram} onChange={e => updateSocial('instagram', e.target.value)} />
              </label>
              <label>
                <span className="block text-xs text-muted-foreground mb-1">Facebook URL</span>
                <input className="w-full bg-background border border-border p-2 outline-none focus:border-accent" value={data.siteConfig.social.facebook} onChange={e => updateSocial('facebook', e.target.value)} />
              </label>
              <label>
                <span className="block text-xs text-muted-foreground mb-1">Zalo Link/Phone</span>
                <input className="w-full bg-background border border-border p-2 outline-none focus:border-accent" value={data.siteConfig.social.zalo} onChange={e => updateSocial('zalo', e.target.value)} />
              </label>
            </div>
          </section>

          {/* Hero & About */}
          <section className="bg-card p-6 border border-border">
            <h2 className="text-xl text-accent uppercase mb-6 tracking-widest border-b border-border pb-2">2. Trang Chủ (Hero & About)</h2>
            <div className="flex flex-col gap-4">
              <label>
                <span className="block text-xs text-muted-foreground mb-1">Showreel TikTok Video URL</span>
                <input className="w-full bg-background border border-border p-2 outline-none focus:border-accent" value={data.hero.showreelVideoTiktokUrl} onChange={e => updateField('hero', 'showreelVideoTiktokUrl', e.target.value)} />
              </label>
              <label>
                <span className="block text-xs text-muted-foreground mb-1">Hero Cover Image URL</span>
                <input className="w-full bg-background border border-border p-2 outline-none focus:border-accent" value={data.hero.coverImage} onChange={e => updateField('hero', 'coverImage', e.target.value)} />
              </label>
              <label>
                <span className="block text-xs text-muted-foreground mb-1">About Bio</span>
                <textarea className="w-full bg-background border border-border p-2 outline-none focus:border-accent h-32" value={data.about.bio} onChange={e => updateField('about', 'bio', e.target.value)} />
              </label>
              <label>
                <span className="block text-xs text-muted-foreground mb-1">Tools (cách nhau dấu phẩy)</span>
                <input className="w-full bg-background border border-border p-2 outline-none focus:border-accent" value={data.about.tools.join(", ")} onChange={e => updateField('about', 'tools', e.target.value.split(",").map(s=>s.trim()) as any)} />
              </label>
            </div>
          </section>

        </div>

        {/* Right Column: Projects Array */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-accent uppercase tracking-widest">3. Projects List</h2>
            <Button variant="outline" size="sm" onClick={addProject} className="gap-2 text-xs py-2 px-3 border-border text-foreground hover:bg-neutral-800"><Plus size={14}/> Add Custom Project</Button>
          </div>

          <div className="flex flex-col gap-4">
            {data.projects.map((project: any, idx: number) => (
              <div key={idx} className="bg-card border border-border p-4 relative group">
                <button onClick={() => removeProject(idx)} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                
                <div className="grid grid-cols-2 gap-4 mb-4 pr-8">
                   <label>
                     <span className="block text-[10px] uppercase text-muted-foreground mb-1">Title</span>
                     <input className="w-full bg-background border border-border p-2 text-sm outline-none focus:border-accent" value={project.title} onChange={e => updateProject(idx, 'title', e.target.value)} />
                   </label>
                   <label>
                     <span className="block text-[10px] uppercase text-muted-foreground mb-1">Category</span>
                     <input className="w-full bg-background border border-border p-2 text-sm outline-none focus:border-accent" value={project.category} onChange={e => updateProject(idx, 'category', e.target.value)} />
                   </label>
                </div>
                
                <label className="block mb-4">
                  <span className="block text-[10px] uppercase text-muted-foreground mb-1">Description</span>
                  <input className="w-full bg-background border border-border p-2 text-sm outline-none focus:border-accent" value={project.description} onChange={e => updateProject(idx, 'description', e.target.value)} />
                </label>

                <label className="block mb-4">
                  <span className="block text-[10px] uppercase text-muted-foreground mb-1">Thumbnail Cover (URL/Local Path)</span>
                  <input className="w-full bg-background border border-border p-2 text-sm outline-none focus:border-accent" value={project.thumbnailUrl} onChange={e => updateProject(idx, 'thumbnailUrl', e.target.value)} />
                </label>

                <label className="block mb-4">
                  <span className="block text-[10px] uppercase text-muted-foreground mb-1">TikTok Video URL</span>
                  <input className="w-full bg-background border border-border p-2 text-sm outline-none focus:border-accent" value={project.tiktokUrl} onChange={e => updateProject(idx, 'tiktokUrl', e.target.value)} />
                </label>

                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input type="checkbox" checked={project.featured} onChange={e => updateProject(idx, 'featured', e.target.checked)} className="accent-accent w-4 h-4" />
                  <span className="text-sm">Hiển thị ở mục Featured Work? (nếu không, sẽ nằm ở mục More Works)</span>
                </label>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
