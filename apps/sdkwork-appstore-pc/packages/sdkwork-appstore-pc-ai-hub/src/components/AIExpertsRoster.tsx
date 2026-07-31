import React, { useState, useMemo } from 'react';
import { useTranslation as useI18n } from 'react-i18next';
import { Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { ExpertItem } from '../../../../src/types';
import { ExpertCard } from './ExpertCard';

interface AIExpertsRosterProps {
  experts: ExpertItem[];
  myExpertIds: string[];
  onToggleMyExpert: (expertId: string, e?: React.MouseEvent) => void;
  onSelectExpert: (expert: ExpertItem) => void;
  onOpenSandboxChat: (expert: ExpertItem, e: React.MouseEvent) => void;
  searchQuery: string;
  showOnlyMine: boolean;
  selectedScenario: string | null;
}

const FILTER_TAGS = [
  '全部',
  'OPC:一人公司',
  '腾讯专家',
  '产品设计',
  '技术工程',
  '金融投资',
  '全球发展',
  '教育学习',
  '游戏空间',
  '数据智能',
  '营销增长',
  '内容创作',
  '销售商务',
  '运营人力',
  '项目质量',
  '法务安全',
  '行业顾问'
];

type SortType = 'comprehensive' | 'hottest' | 'newest';

export const AIExpertsRoster: React.FC<AIExpertsRosterProps> = ({
  experts,
  myExpertIds,
  onToggleMyExpert,
  onSelectExpert,
  onOpenSandboxChat,
  searchQuery,
  showOnlyMine,
  selectedScenario
}) => {
  const { t } = useI18n();
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [sortType, setSortType] = useState<SortType>('comprehensive');

  const filteredExperts = useMemo(() => {
    return experts.filter((exp) => {
      // Show only mine filter
      if (showOnlyMine && !myExpertIds.includes(exp.id)) {
        return false;
      }

      // Scenario filter
      if (selectedScenario && exp.scenarioCategory !== selectedScenario) {
        return false;
      }

      // Filter tag filter
      if (selectedTag !== '全部' && exp.filterTag !== selectedTag && !exp.tags.includes(selectedTag)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = exp.name.toLowerCase().includes(q);
        const matchNickname = exp.nickname.toLowerCase().includes(q);
        const matchDesc = exp.description.toLowerCase().includes(q);
        const matchTag = exp.tags.some((tg) => tg.toLowerCase().includes(q));
        if (!matchName && !matchNickname && !matchDesc && !matchTag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortType === 'hottest') {
        return b.popularity - a.popularity;
      }
      if (sortType === 'newest') {
        return b.rating - a.rating;
      }
      // Comprehensive default sort (featured first, then popularity)
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.popularity - a.popularity;
    });
  }, [experts, myExpertIds, showOnlyMine, selectedScenario, selectedTag, searchQuery, sortType]);

  return (
    <div className="space-y-4 pt-2">
      {/* Header Row for Experts Grid */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>{t('aihub.experts.rosterTitle', '专家')}</span>
            <span className="text-sm font-semibold text-slate-400">专家团</span>
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
            {filteredExperts.length} 位
          </span>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setSortType('comprehensive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sortType === 'comprehensive'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('aihub.experts.sort.comprehensive', '综合')}
          </button>
          <button
            type="button"
            onClick={() => setSortType('hottest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sortType === 'hottest'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('aihub.experts.sort.hottest', '最热')}
          </button>
          <button
            type="button"
            onClick={() => setSortType('newest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sortType === 'newest'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('aihub.experts.sort.newest', '最新')}
          </button>
        </div>
      </div>

      {/* Filter Tag Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs font-medium border-b border-slate-800/80">
        {FILTER_TAGS.map((tag) => {
          const active = selectedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all border shrink-0 ${
                active
                  ? 'bg-slate-100 text-slate-900 border-white font-bold shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Expert Cards Grid */}
      {filteredExperts.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <p className="text-slate-400 text-sm">
            {t('common.noData', '暂无符合条件的专家')}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedTag('全部');
            }}
            className="text-xs text-indigo-400 hover:underline"
          >
            重置筛选条件
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredExperts.map((exp) => (
            <ExpertCard
              key={exp.id}
              expert={exp}
              isMyExpert={myExpertIds.includes(exp.id)}
              onToggleMyExpert={onToggleMyExpert}
              onClickCard={onSelectExpert}
              onOpenSandboxChat={onOpenSandboxChat}
            />
          ))}
        </div>
      )}
    </div>
  );
};
