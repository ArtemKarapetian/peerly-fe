interface CourseHeaderProps {
  title: string;
  coverColor?: string;
  description?: string;
}

export function CourseHeader({ title, coverColor = "#f2b2d6", description }: CourseHeaderProps) {
  return (
    <div className="bg-card border-2 border-border rounded-[20px] overflow-hidden">
      <div className="w-full h-[100px]" style={{ backgroundColor: coverColor }} />

      <div className="px-6 pb-6 pt-4 space-y-2">
        <h1 className="text-[32px] font-medium leading-[1.05] tracking-[-0.5px] text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="text-[15px] text-muted-foreground leading-[1.5]">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
