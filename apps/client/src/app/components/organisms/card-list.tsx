type CardListProps<TData> = {
  data: TData[];
  isLoading?: boolean;
  render: (value: TData, isLoading: boolean, key: number) => JSX.Element;
};

export default function CardList<TData>({
  data,
  render,
  isLoading,
}: CardListProps<TData>) {
  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((p, rowIndex) =>
          render({} as TData, true, rowIndex)
        )}
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-3 gap-5">
      {data.map((d, index) => render(d, false, index))}
    </div>
  );
}
