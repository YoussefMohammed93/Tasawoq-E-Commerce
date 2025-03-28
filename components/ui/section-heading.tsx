interface SectionHeadingProps {
  title: string;
  description: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
}) => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
