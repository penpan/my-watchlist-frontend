// src/components/FileUploader.jsx
import { useState } from 'react';

export default function FileUploader({ jwt, strapiUrl }) {
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [message, setMessage] = useState('');

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setStatus('uploading');

    const formData = new FormData();
    // Strapi expects the field name to be 'files'
    formData.append('files', files[0]); 

    try {
      const response = await fetch(`${strapiUrl}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      setStatus('success');
      setMessage(`Successfully uploaded: ${result[0].name}`);
      
      // Optional: Reload page to show new file (we will build the list next)
      setTimeout(() => window.location.reload(), 1000); 

    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('Error uploading file. Check console.');
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-10 text-center transition cursor-pointer 
        ${status === 'uploading' ? 'bg-blue-900 border-blue-500' : 'bg-slate-800 border-slate-600 hover:bg-slate-700'}
        ${status === 'success' ? 'border-green-500 bg-green-900/20' : ''}
        ${status === 'error' ? 'border-red-500' : ''}
      `}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleUpload(e.dataTransfer.files);
      }}
      onClick={() => document.getElementById('fileInput').click()}
    >
      <input 
        type="file" 
        id="fileInput" 
        className="hidden" 
        onChange={(e) => handleUpload(e.target.files)} 
      />

      {status === 'idle' && (
        <>
          <p className="text-xl text-gray-300 font-bold">Drag & Drop files here</p>
          <p className="text-sm text-gray-500 mt-2">or click to browse</p>
        </>
      )}

      {status === 'uploading' && (
        <p className="text-blue-400 animate-pulse">Uploading...</p>
      )}

      {status === 'success' && (
        <p className="text-green-400 font-bold">✅ {message}</p>
      )}

      {status === 'error' && (
        <p className="text-red-400 font-bold">❌ {message}</p>
      )}
    </div>
  );
}