import React from 'react';
import { Sparkles, Bot, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AIHubHeaderBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-6 bg-slate-900 dark:bg-[#12141c] border border-slate-800 rounded-2xl text-white shadow-lg relative overflow-hidden">
      <div className="z-10 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('aihub.header.badge', 'AI Hub 智能专区')}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {t('aihub.header.title', '探索前沿 LLM 大模型与 AI 桌面助手')}
        </h1>
        <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
          {t('aihub.header.subtitle', '收录全网主流人工智能应用，涵盖对话问答、知识库管理、AI 代码辅助与多模态创作。')}
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="z-10 grid grid-cols-2 gap-2 shrink-0">
        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center gap-2.5">
          <Bot className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-white">{t('aihub.header.chatAssistant', '智能对话助手')}</div>
            <div className="text-[10px] text-slate-400">Qwen / Kimi / Doubao</div>
          </div>
        </div>
        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-white">{t('aihub.header.knowledgeCopilot', '个人知识库 Copilot')}</div>
            <div className="text-[10px] text-slate-400">ima.copilot</div>
          </div>
        </div>
      </div>
    </div>
  );
};
