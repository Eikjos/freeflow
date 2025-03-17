import { Button } from "@components/ui/button";

export default function NotFoundEnterprise() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>
        The page you are looking for might have been removed or is temporarily
        unavailable.
      </p>
      <Button asChild>
        <a href="/">Retour à l'accueil</a>
      </Button>
    </div>
  );
}
