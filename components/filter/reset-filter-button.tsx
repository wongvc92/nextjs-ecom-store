import { Button } from "@/components/ui/button";
import Link from "next/link";

const ResetFilterButton = () => {
  return (
    <Button type="button" variant="secondary" className="w-full">
      <Link href="/products?page=1">Reset filter</Link>
    </Button>
  );
};

export default ResetFilterButton;
