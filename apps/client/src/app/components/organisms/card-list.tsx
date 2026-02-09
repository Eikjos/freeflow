import { useTranslations } from "next-intl";

type CardListProps<TData> = {
  data: TData[];
  isLoading?: boolean;
  emptyMessage: string;
  render: (value: TData, isLoading: boolean, key: number) => JSX.Element;
};

export default function CardList<TData>({
  data,
  render,
  isLoading,
  emptyMessage
}: CardListProps<TData>) {
  const t = useTranslations();
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
    <>
      {data && data.length > 0 && (
        <div className="w-full grid grid-cols-3 gap-5">
          {data.map((d, index) => render(d, false, index))}
        </div>
      )}
      {data.length === 0 && (
        <div className="w-full pt-64">
          <p className="w-56 text-center mx-auto">{t(emptyMessage)}</p>
        </div>
      )}
    </>
  );
}
