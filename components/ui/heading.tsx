interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <>
      <div className="flex flex-col space-y-2">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-muted-500">{description}</p>
      </div>
    </>
  );
};
