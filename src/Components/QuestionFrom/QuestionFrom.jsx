import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MAX_LENGTH = 300;

const QuestionForm = ({ productId, productName, onSuccess }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const remaining = MAX_LENGTH - question.length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.warning("Please login first");
      return;
    }

    if (!question.trim()) {
      toast.error("Question cannot be empty");
      return;
    }

    if (question.length > MAX_LENGTH) {
      toast.error("Question is too long");
      return;
    }

    const qData = {
      productId,
      productName,
      userName: user?.displayName,
      userEmail: user?.email,
      question: question.trim(),
    };

    try {
      setLoading(true);

      await axiosSecure.post("/product-questions", qData);

      toast.success("Your question has been submitted");
      setQuestion("");

      onSuccess && onSuccess();
    } catch {
      toast.error("Failed to submit question, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-5 p-5 border border-gray-300 rounded-2xl bg-white shadow-sm"
    >
      <h3 className="text-xl font-semibold">Ask a Question</h3>

      {/* User Name */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">Your Name</label>
        <input
          type="text"
          value={user?.displayName || ""}
          readOnly
          className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">Your Email</label>
        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Product */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">Product</label>
        <input
          type="text"
          value={productName || ""}
          readOnly
          className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Question */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">
          Your Question <span className="text-red-500">*</span>
        </label>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          maxLength={350}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none"
          placeholder="Write your question clearly so the seller can answer better..."
        ></textarea>

        <div className="flex justify-between text-xs">
          <span className={remaining < 0 ? "text-red-500" : "text-gray-500"}>
            {remaining} characters left
          </span>
        </div>
      </div>

      {/* Blue Primary Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all"
      >
        {loading ? "Submitting..." : "Submit Question"}
      </button>
    </form>
  );
};

export default QuestionForm;
