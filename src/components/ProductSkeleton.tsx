const ProductSkeleton = () => (
  <div className="overflow-hidden bg-white rounded-lg shadow-sm animate-pulse">
    <div className="aspect-[4/3] bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-6 bg-gray-200 rounded w-1/3 mt-1" />
      <div className="h-10 bg-gray-200 rounded w-full mt-2" />
    </div>
  </div>
);

export default ProductSkeleton;
