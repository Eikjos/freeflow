import ExpenseForm from '@components/templates/expense-form';
import { useTranslations } from 'next-intl';

export default function CreateExpensePage() {
  const t = useTranslations();
  return (
    <>
      <h1 className="text-4xl font-amica">{t('expense.create.titlePage')}</h1>
      <ExpenseForm className="mx-auto mt-10" />
    </>
  );
}
