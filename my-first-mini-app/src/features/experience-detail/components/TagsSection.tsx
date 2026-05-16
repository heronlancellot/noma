const TAG_STYLES = [
  { bg: 'bg-[#fcedd2]', text: 'text-[#b88c3a]', border: 'border-[#fcedd2]' },
  { bg: 'bg-[#fcebe8]', text: 'text-secondary',  border: 'border-[#fcebe8]'  },
  { bg: 'bg-[#fcebe8]', text: 'text-secondary',  border: 'border-[#fcebe8]'  },
];

interface TagsSectionProps {
  tags: string[];
}

export function TagsSection({ tags }: TagsSectionProps) {
  return (
    <div>
      <h3 className="font-h3 text-h3 text-on-surface mb-4">Tags</h3>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag, i) => {
          const ts = TAG_STYLES[i % TAG_STYLES.length];
          return (
            <span
              key={tag}
              className={`${ts.bg} ${ts.text} border ${ts.border} px-5 py-2 rounded-full font-label-caps text-label-caps`}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
}
