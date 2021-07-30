const Error = ({ error = null }) => {
  if (!error) return null;
  return (
    <span className="animate-shake bg-red-50 text-red-700 text-sm font-medium px-4 py-1 rounded">
      {error}
    </span>
  );
};

export default Error;
