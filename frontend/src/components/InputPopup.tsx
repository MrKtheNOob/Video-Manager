import { useState, type FormEvent } from "react";

interface InputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  inputValue: string;
  setInputValue: (s: string) => void;
}
export function InputPopup({
  isOpen,
  onClose,
  onSubmit,
  inputValue,
  setInputValue,
}: InputPopupProps) {
  const [inputError, setInputError] = useState(false);

  // Handle local form submission logic, including validation
  const handleInternalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      setInputError(true);
      return;
    }
    setInputError(false);
    onSubmit(); // Call the main App component's submission logic
  };

  if (!isOpen) return null;

  return (
    // Modal Overlay (Fixed position, covers entire screen)
    <div
      className="fixed inset-0 bg-gray-300 bg-opacity-20 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={(e) => {
        // Only close if clicking the overlay, not the content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Modal Content Card */}
      <div
        className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md transform transition-all duration-300 ease-out"
        // Prevent overlay click handler from triggering when clicking inside the card
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-3">
          <h2 className="text-2xl font-extrabold text-gray-800">
            Submit Data as JSON
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition duration-150 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleInternalSubmit}>
          <div className="space-y-4">
            <label
              htmlFor="inputField"
              className="block text-sm font-medium text-gray-700"
            >
              Your Input Text
            </label>
            <input
              id="inputField"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (e.target.value.trim() !== "") setInputError(false); // Clear error on change
              }}
              placeholder={
                inputError
                  ? "Input is required!"
                  : "Type your message or value here..."
              }
              className={`mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm text-base 
                focus:ring-indigo-500 focus:border-indigo-500 
                ${
                  inputError
                    ? "border-red-500 ring-red-500 placeholder-red-400"
                    : "border-gray-300"
                }`}
              autoFocus
            />
          </div>

          {inputError && (
            <p className="text-sm text-red-500 mt-2">
              Please enter a value before submitting.
            </p>
          )}

          {/* Submission Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 transition bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-400"
            >
              Submit & Convert to JSON
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// // --- 3. Main Application Component ---

// const App = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [inputValue, setInputValue] = useState('');
//   const [submissionResult, setSubmissionResult] = useState(null);

//   const openModal = useCallback(() => {
//     setIsModalOpen(true);
//     setSubmissionResult(null); // Clear previous result on open
//   }, []);

//   const closeModal = useCallback(() => {
//     setIsModalOpen(false);
//   }, []);

//   const handleSubmit = useCallback(() => {
//     // 1. Create the structured data object
//     const dataObject = {
//       id: Math.random().toString(36).substring(2, 9), // Simple unique ID
//       timestamp: new Date().toISOString(),
//       source: 'UserModalInput',
//       payload: {
//           message: inputValue,
//           length: inputValue.length,
//       },
//       processed: false,
//     };

//     // 2. Save the result and close the modal
//     setSubmissionResult(dataObject);
//     setInputValue(''); // Reset input field
//     closeModal();
//   }, [inputValue, closeModal]);

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8" style={{ fontFamily: 'Inter, sans-serif' }}>

//       {/* Main Control Area */}
//       <div className="mt-12 text-center w-full max-w-2xl">
//         <h1 className="text-4xl font-extrabold text-gray-900 mb-4">React JSON Input Demo</h1>
//         <p className="text-gray-600 mb-8">Click the button to open the fully responsive and centered input modal.</p>

//         <button
//           onClick={openModal}
//           className="px-8 py-3 bg-green-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
//         >
//           Launch Input Popup
//         </button>
//       </div>

//       {/* Submission Output Area */}
//       {submissionResult && (
//         <div className="mt-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl border-4 border-indigo-200 p-6 md:p-8 transition-all duration-500">
//           <h2 className="text-2xl font-bold mb-3 text-indigo-700 flex items-center">
//             <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
//             Submitted JSON Object
//           </h2>
//           <pre className="bg-gray-800 text-green-300 p-4 rounded-lg overflow-x-auto text-sm shadow-inner">
//             {JSON.stringify(submissionResult, null, 2)}
//           </pre>
//           <p className="mt-4 text-sm text-gray-500">
//             This is the structure that would typically be sent to your API endpoint.
//           </p>
//         </div>
//       )}

//       {/* The Modal Component */}
//       <CenteredModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         onSubmit={handleSubmit}
//         inputValue={inputValue}
//         setInputValue={setInputValue}
//       />
//     </div>
//   );
// };

// export default App;
