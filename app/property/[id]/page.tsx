import { properties } from "@/lib/data";
import { PropertyDetails } from "@/components/PropertyDetails";

export function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id.toString(),
  }));
}

export default function PropertyPage() {
  return <PropertyDetails />;
}