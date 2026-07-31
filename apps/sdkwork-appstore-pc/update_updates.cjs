const fs = require('fs');

const content = `import { useState, useEffect } from 'react';
import { AppStoreService } from '../services/api';
import { AppItem } from '../types';
import { DynamicIcon } from '../components/DynamicIcon';
import { Link } from 'react-router-dom';

export default function Updates() {
  const [appsWithUpdates, setAppsWithUpdates] = useState<AppItem[]>([]);
  const [updating, setUpdating] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotes, setExpandedNotes] = useState<string[]>([]);

  useEffect(() => {
    async function loadUpdates() {
      try {
        const data = await AppStoreService.getPendingUpdates();
        setAppsWithUpdates(data);
      } catch (error) {
        console.error("Failed to load updates", error);
      } finally {
        setLoading(false);
      }
    }
    loadUpdates();
  }, []);

  const handleUpdate = async (id: string) => {
    setUpdating(prev => [...prev, id]);
    try {
      await AppStoreService.updateApp(id);
      setAppsWithUpdates(prev => prev.filter(app => app.id !== id));
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setUpdating(prev => prev.filter(uid => uid !== id));
    }
  };

  const handleUpdateAll = async () => {
    const ids = appsWithUpdates.map(a => a.id);
    setUpdating(ids);
    try {
      await AppStoreService.updateAllApps(ids);
      setAppsWithUpdates([]);
    } catch (error) {
      console.error("Batch update failed", error);
    } finally {
      setUpdating([]);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedNotes(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-[#0A84FF]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1C1C1E] dark:text-[#F5F5F5]">Updates</h1>
        {appsWithUpdates.length > 0 && (
          <button 
            onClick={handleUpdateAll} 
            disabled={updating.length > 0} 
            className="text-blue-600 dark:text-[#0A84FF] font-medium text-[17px] hover:text-blue-800 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
          >
            {updating.length === appsWithUpdates.length ? 'Updating All...' : 'Update All'}
          </button>
        )}
      </div>

      <section>
        {appsWithUpdates.length > 0 && (
          <h2 className="text-xl font-bold tracking-tight mb-4 text-[#1C1C1E] dark:text-[#F5F5F5]">Pending</h2>
        )}
        <div className="flex flex-col gap-6">
          {appsWithUpdates.map(app => {
            const isUpdating = updating.includes(app.id);
            const isExpanded = expandedNotes.includes(app.id);
            return (
              <div key={app.id} className="flex flex-col pb-6 border-b border-gray-100 dark:border-[#2C2C2E] last:border-0">
                <div className="flex items-start gap-4">
                  <Link to={\`/app/\${app.id}\`} className="flex-shrink-0">
                    <div className={\`w-[72px] h-[72px] rounded-2xl flex items-center justify-center shadow-md \${app.iconColor}\`}>
                      <DynamicIcon name={app.icon} className="text-white w-9 h-9" />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <Link to={\`/app/\${app.id}\`} className="hover:underline decoration-[#1C1C1E] dark:decoration-white">
                          <h3 className="font-bold text-[17px] text-[#1C1C1E] dark:text-[#F5F5F5] truncate">{app.name}</h3>
                        </Link>
                        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">{app.developer}</p>
                      </div>
                      <button 
                        onClick={() => handleUpdate(app.id)}
                        disabled={isUpdating}
                        className="flex-shrink-0 bg-gray-100 dark:bg-[#2C2C2E] text-blue-600 dark:text-[#0A84FF] font-bold text-[13px] px-5 py-[7px] rounded-full uppercase tracking-wide hover:bg-gray-200 dark:hover:bg-[#3C3C3E] transition-colors disabled:opacity-50 w-[84px]"
                      >
                        {isUpdating ? (
                          <div className="w-5 h-5 mx-auto border-2 border-blue-600/30 border-t-blue-600 dark:border-[#0A84FF]/30 dark:border-t-[#0A84FF] rounded-full animate-spin"></div>
                        ) : 'Update'}
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1.5 text-[13px] text-gray-500 dark:text-gray-400 font-medium">
                        <span>Version {app.whatsNew?.version}</span>
                        <span>{app.whatsNew?.date}</span>
                      </div>
                      <div className="relative">
                        <p className={\`text-[14px] text-[#1C1C1E] dark:text-[#F5F5F5] leading-relaxed whitespace-pre-wrap \${!isExpanded ? 'line-clamp-2' : ''}\`}>
                          {app.whatsNew?.notes}
                        </p>
                        {!isExpanded && app.whatsNew?.notes && app.whatsNew.notes.length > 100 && (
                          <span 
                            onClick={() => toggleExpand(app.id)}
                            className="absolute bottom-0 right-0 bg-white dark:bg-black pl-4 text-blue-600 dark:text-[#0A84FF] cursor-pointer hover:underline text-[14px]"
                          >
                            more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {appsWithUpdates.length === 0 && (
             <div className="py-32 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
               <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 dark:bg-[#1C1C1E] flex items-center justify-center">
                 <span className="text-5xl">🎉</span>
               </div>
               <p className="text-2xl font-bold text-[#1C1C1E] dark:text-[#F5F5F5] mb-2">You're all caught up!</p>
               <p className="text-[17px]">All your apps are up to date.</p>
             </div>
          )}
        </div>
      </section>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/Updates.tsx', content);
