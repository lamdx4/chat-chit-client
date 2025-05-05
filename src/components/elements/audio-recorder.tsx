import React, { useState, useRef } from "react";

interface AudioRecorderProps {
  setFileRecording: (file: Blob | null) => void; // Truyền file Blob ra ngoài thông qua props
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ setFileRecording }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      // Yêu cầu quyền truy cập microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = []; // Reset mảng chứa dữ liệu âm thanh

      // Lắng nghe sự kiện "dataavailable" - Khi có dữ liệu âm thanh mới
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Lắng nghe sự kiện "stop" - Khi quá trình ghi âm kết thúc
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url); // Tạo URL cho file audio và lưu vào state
        setFileRecording(audioBlob); // Gửi file Blob ra ngoài qua props
      };

      // Bắt đầu ghi âm
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Lỗi khi truy cập microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Dừng ghi âm
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Audio Recorder</h1>
      <div className="flex items-center space-x-4">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Stop Recording
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Start Recording
          </button>
        )}
        {isRecording && (
          <div className="w-4 h-4 rounded-full bg-red-500 animate-ping"></div>
        )}
      </div>

      {audioUrl && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Recorded Audio:</h2>
          <audio controls src={audioUrl} className="mt-2"></audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;