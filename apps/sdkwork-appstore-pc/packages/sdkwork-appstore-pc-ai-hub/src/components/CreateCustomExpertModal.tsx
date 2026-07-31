import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';

interface CreateCustomExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateExpert: (expertData: {
    name: string;
    nickname: string;
    category: string;
    description: string;
    systemPrompt: string;
    tags: string[];
  }) => void;
}

export const CreateCustomExpertModal: React.FC<CreateCustomExpertModalProps> = ({
  isOpen,
  onClose,
  onCreateExpert,
}) => {
  const { t } = useTranslation();

  const [customName, setCustomName] = useState('');
  const [customNickname, setCustomNickname] = useState('');
  const [customCategory, setCustomCategory] = useState('工程开发');
  const [customDesc, setCustomDesc] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customTags, setCustomTags] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customDesc.trim()) return;

    onCreateExpert({
      name: customName.trim(),
      nickname: customNickname.trim() || '自定义专家',
      category: customCategory,
      description: customDesc.trim(),
      systemPrompt: customPrompt.trim(),
      tags: customTags ? customTags.split(',').map((t) => t.trim()) : ['自定义', 'AI助手'],
    });

    // Reset Form
    setCustomName('');
    setCustomNickname('');
    setCustomDesc('');
    setCustomPrompt('');
    setCustomTags('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-400" />
          <span>{t('aihub.customModal.title', '创建自定义 AI 专家')}</span>
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          {t('aihub.customModal.subtitle', '设定专属专家职称、系统提示词 (System Prompt) 与专业技能标签')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {t('aihub.customModal.nameLabel', '专家职称 / 名称 *')}
            </label>
            <input
              type="text"
              required
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={t('aihub.customModal.namePlaceholder', '例如：量化高频交易专家 / React 重构大师')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {t('aihub.customModal.nicknameLabel', '作者 / 昵称')}
            </label>
            <input
              type="text"
              value={customNickname}
              onChange={(e) => setCustomNickname(e.target.value)}
              placeholder={t('aihub.customModal.nicknamePlaceholder', '例如：极客小王')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {t('aihub.customModal.categoryLabel', '所属场景分类')}
            </label>
            <select
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="工程开发">{t('aihub.experts.scenarios.dev', '工程开发')}</option>
              <option value="内容创作">{t('aihub.experts.scenarios.content', '内容创作')}</option>
              <option value="投资分析">{t('aihub.experts.scenarios.invest', '投资分析')}</option>
              <option value="法律咨询">{t('aihub.experts.scenarios.legal', '法律咨询')}</option>
              <option value="小微企业">{t('aihub.experts.scenarios.business', '小微企业')}</option>
              <option value="电商运营">{t('aihub.experts.scenarios.ecom', '电商运营')}</option>
              <option value="数据分析">{t('aihub.experts.scenarios.data', '数据分析')}</option>
              <option value="专业文档">{t('aihub.experts.scenarios.doc', '专业文档')}</option>
              <option value="产品设计">{t('aihub.experts.scenarios.design', '产品设计')}</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {t('aihub.customModal.descLabel', '专家职责描述 *')}
            </label>
            <textarea
              required
              rows={2}
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              placeholder={t('aihub.customModal.descPlaceholder', '精通某项技术的专家，擅长解决什么核心痛点...')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {t('aihub.customModal.promptLabel', '系统提示词 (System Prompt)')}
            </label>
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={t('aihub.customModal.promptPlaceholder', '你是一名资深专家，请按照以下标准为用户服务...')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {t('aihub.customModal.tagsLabel', '能力标签 (逗号分隔)')}
            </label>
            <input
              type="text"
              value={customTags}
              onChange={(e) => setCustomTags(e.target.value)}
              placeholder={t('aihub.customModal.tagsPlaceholder', '例如：高频交易, 回测, Python')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              {t('aihub.customModal.cancel', '取消')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              {t('aihub.customModal.create', '确认创建')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
