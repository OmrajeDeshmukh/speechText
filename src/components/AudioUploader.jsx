import { useState } from "react";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";

const AudioUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [transcription, setTranscription] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select an audio file first.");
      return;
    }

    setUploading(true);
    setMessage("");
    setTranscription("");

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const uploadResponse = await axios.post(
        "http://localhost:5000/upload/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("✅ Upload successful!");

      const fileUrl = uploadResponse.data.file_url;

      const transcribeResponse = await axios.post(
        "http://localhost:5000/transcription/transcribe",
        { audio_url: fileUrl }
      );

      setTranscription(transcribeResponse.data.transcription);
    } catch (error) {
      setMessage("❌ Error processing request.");
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 shadow-lg rounded-lg w-full max-w-md mx-auto text-center border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">📤 Upload & Transcribe</h2>

      <div className="flex flex-col items-center">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`mt-4 flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <FaCloudUploadAlt className="mr-2" />
          {uploading ? "Processing..." : "Upload & Transcribe"}
        </button>
      </div>

      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}

      {transcription && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow text-left">
          <h3 className="text-lg font-semibold">📝 Transcription:</h3>
          <p className="text-gray-700">{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
