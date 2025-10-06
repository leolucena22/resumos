const AdminSkeletonLoader = () => (
  <div className="bg-white rounded-lg shadow animate-pulse">
    <div className="border-b">
      <div className="flex">
        <div className="w-1/4 h-12 bg-gray-200 rounded-tl-lg"></div>
        <div className="w-1/4 h-12 bg-gray-200"></div>
        <div className="w-1/4 h-12 bg-gray-200"></div>
        <div className="w-1/4 h-12 bg-gray-200"></div>
        <div className="w-1/4 h-12 bg-gray-200"></div>
        <div className="w-1/4 h-12 bg-gray-200 rounded-tr-lg"></div>
      </div>
    </div>
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export const CongressListSkeleton = () => (
    <div className="space-y-2 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-200">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mt-2"></div>
            </div>
        ))}
    </div>
);

export default AdminSkeletonLoader;