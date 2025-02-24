import CustomerForm from "@components/templates/customer-form";

export default function CreateCustomerPage() {
  return (
    <>
      <h1 className="font-amica text-4xl mb-4">Création d'un client</h1>
      <CustomerForm className="mt-20" />
    </>
  );
}
