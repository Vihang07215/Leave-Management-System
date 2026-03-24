const Button = ({ text, type = "submit", isLoading }) => {
  return (
    <button
      type={type}
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : text}
    </button>
  );
};

export default Button;