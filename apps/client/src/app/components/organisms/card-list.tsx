type CardListProps<TData> = {
  data: TData[];
  render: (value: TData, key: number) => JSX.Element;
};

export default function CardList<TData>({
  data,
  render,
}: CardListProps<TData>) {
  return <>{data.map((d, index) => render(d, index))}</>;
}
