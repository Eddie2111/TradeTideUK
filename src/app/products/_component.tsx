"use client";
import { Suspense, useEffect, useState } from "react";
import ProductList from "@/components/modules/product/product-list";
import ProductFilters from "@/components/modules/product/product-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/lib/repositories/product.repository";
import { $Enums, Prisma } from "@prisma/client";
import { LoadingSpinnerLayout } from "@/components/common/loadingSpinner";

type TProducts = {
  products: {
    name: string;
    id: string;
    image: string[];
    createdAt: Date;
    updatedAt: Date;
    description: string;
    price: number;
    quantity: number;
    attributes: Prisma.JsonValue | null;
    color: string[];
    categories: string[];
    status: $Enums.ProductStatus;
  }[];
};

export default function ProductsPage() {
  const [data, setData] = useState<TProducts | undefined>();
  useEffect(() => {
    async function fetchData() {
      const response = await getProducts({ skip: 0, take: 10 });
      if (response) setData(response);
      else console.log("error");
    }
    fetchData();
  }, [setData]);

  if (data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 lg:w-72">
            <ProductFilters />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">All Products</h1>
            <Suspense fallback={<ProductsLoading />}>
              <ProductList products={data.products} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  } else {
    return <LoadingSpinnerLayout />;
  }
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
