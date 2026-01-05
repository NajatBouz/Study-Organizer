export default function PageContainer({ title, children }) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h1>
      {children}
    </div>
  );
}
