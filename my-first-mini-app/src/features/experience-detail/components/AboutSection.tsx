interface AboutSectionProps {
  description: string;
}

export function AboutSection({ description }: AboutSectionProps) {
  return (
    <div>
      <h2 className="font-h2 text-on-surface mb-4">About this experience</h2>
      <p className="font-body-md text-on-surface-variant leading-relaxed">
        {description}
      </p>
    </div>
  );
}
