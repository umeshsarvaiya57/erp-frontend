import React, { useState } from 'react';
import { History, Sparkles, MessageSquare } from 'lucide-react';
import { useCRM } from '../../hooks/useCRM';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { Pagination } from '../../components/ui/Pagination';
import { Badge } from '../../components/ui/Badge';

export const TimelineActivities = () => {
  const [page, setPage] = useState(1);
  const { timeline, timelinePagination, isLoadingTimeline } = useCRM({ page, limit: 15 });

  if (isLoadingTimeline) {
    return <Loader fullscreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 select-none">
        <History className="h-6 w-6 text-slate-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-none">CRM Timeline</h1>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">Audit log of customer and lead activities</span>
        </div>
      </div>

      <Card title="Activity Feed" subtitle="Chronological history of workspace changes">
        <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 pl-8 pt-2">
          {timeline.map((act) => (
            <div key={act._id} className="relative select-none">
              {/* Timeline marker */}
              <div className="absolute -left-[30px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-slate-950 shadow shadow-slate-950/20" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-100 hover:border-slate-200/80 rounded-xl p-4 bg-slate-50/30 hover:bg-slate-50/50 transition-all duration-150">
                <div className="space-y-1 max-w-xl">
                  <p className="text-xs font-bold text-slate-800 leading-snug break-words">
                    {act.description}
                  </p>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    Adjusted By: {act.createdBy?.name || 'System'} • {new Date(act.createdAt).toLocaleString()}
                  </span>
                </div>

                <Badge variant="neutral" className="text-[9px] uppercase self-start sm:self-center shrink-0">
                  {act.type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}

          {timeline.length === 0 && (
            <div className="py-12 text-center text-slate-400 font-semibold italic select-none">
              No timeline activities recorded yet in database.
            </div>
          )}
        </div>
      </Card>

      <Pagination
        page={page}
        totalPages={timelinePagination?.totalPages || 1}
        onPageChange={(p) => setPage(p)}
        limit={15}
        total={timelinePagination?.total || 0}
      />
    </div>
  );
};

export default TimelineActivities;
