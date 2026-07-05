import { ThumbsUp } from 'lucide-react';
import type { Comment } from '@sdkwork/comments-app-sdk';

export interface ReviewCardProps {
  comment: Comment;
}

function formatReviewDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatAuthorLabel(authorId: string): string {
  const trimmed = authorId.trim();
  if (!trimmed) return '用户';
  if (trimmed.length <= 8) return `用户 ${trimmed}`;
  return `用户 ${trimmed.slice(0, 8)}…`;
}

export function ReviewCard({ comment }: ReviewCardProps) {
  return (
    <article
      className="rounded-xl p-4"
      style={{ backgroundColor: 'var(--bg-muted)' }}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {formatAuthorLabel(comment.authorId)}
        </span>
        <time
          className="text-[var(--text-xs)] shrink-0"
          style={{ color: 'var(--text-tertiary)' }}
          dateTime={comment.createdAt}
        >
          {formatReviewDate(comment.createdAt)}
        </time>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
        {comment.body}
      </p>
      <div className="mt-3 flex items-center gap-1 text-[var(--text-xs)]" style={{ color: 'var(--text-tertiary)' }}>
        <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
        <span>评价</span>
      </div>
    </article>
  );
}
