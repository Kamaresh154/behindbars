import ProductPageClient from "./ProductPageClient";

export function generateStaticParams() {
  return [{ slug: "silky-sateen-shirt" }];
}

export default function ProductPage() {
  return <ProductPageClient />;
}
