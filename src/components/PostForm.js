// src/components/PostForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostForm() {
  const [studentName, setStudentName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!studentName.trim()) {
      alert('Please enter a name');
      return;
    }

    fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentName }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Post created:', data);
        setStudentName('');
        navigate(`/social-feed?name=${encodeURIComponent(studentName)}`);
      })
      .catch((err) => console.error('Error creating post:', err));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <input
        type="text"
        placeholder="Enter student name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          marginRight: '10px',
        }}
      />
      <button
        type="submit"
        style={{
          backgroundColor: '#30e0a1',
          color: '#000',
          fontWeight: 'bold',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Post
      </button>
    </form>
  );
}
