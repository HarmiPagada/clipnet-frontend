'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import React from 'react'

import '../styles/dashboard.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

import { Upload, Play, X, Check, AlertCircle, Video } from 'lucide-react';

// Define types
interface PreviewData {
  type: 'file' | 'url';
  name?: string;
  size?: string;
  url?: string;
  platform?: string;
}

interface FormData {
  uploadType: 'file' | 'url';
  file: File | null;
  url: string;
  clipTypes: string[];
  tags: string[];
  explanation: string;
  hasSegmenting: string;
  streamerAttribution: string;
  preview: PreviewData | null;
}

interface ValidationErrors {
  upload?: string;
  explanation?: string;
  clipTypes?: string;
  submit?: string;
}

export default function Trainer() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState<boolean>(false)

  // Load dark mode preference on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === 'enabled') {
      setDarkMode(true)
      document.body.classList.add('dark-mode')
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = (isDark: boolean) => {
    setDarkMode(isDark)
    if (isDark) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('darkMode', 'enabled')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('darkMode', 'disabled')
    }
  }

  const handleSignOut = () => {
    // Remove auth cookie/token
    clearAuthToken();
    
    // Redirect to login
    router.push('/auth/login')
  }

  const [formData, setFormData] = useState<FormData>({
    uploadType: 'file',
    file: null,
    url: '',
    clipTypes: [],
    tags: [],
    explanation: '',
    hasSegmenting: '',
    streamerAttribution: '',
    preview: null
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Predefined clip types
  const clipTypes: string[] = [
    'viral_reaction',
    'caption_style', 
    'template_match',
    'drama_reaction',
    'funny_reaction',
    'cringe_reaction',
    'chat_argument',
    'chat_excitement',
    'chat_quote_moment',
    'storytime_clip',
    'life_advice_clip',
    'stitch_clip',
    'fail_clip',
    'gameplay_highlight',
    'hot_take_clip'
  ];

  // Predefined tags
  const availableTags: string[] = [
    'profanity',
    'catchphrase',
    'screaming',
    'laughing',
    'awkward_pause',
    'trending_audio_used',
    'text_to_speech_narration',
    'stitched_with_another_clip',
    'split_screen',
    'fullscreen_gameplay'
  ];

  // Mock streamers list
  const streamers: string[] = [
    'xQc',
    'Pokimane',
    'HasanAbi',
    'Mizkif',
    'Sodapoppin',
    'Asmongold',
    'Ludwig',
    'Valkyrae',
    'Shroud',
    'Ninja'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setFormData(prev => ({
        ...prev,
        file,
        preview: {
          type: 'file',
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        }
      }));
      setErrors(prev => ({ ...prev, upload: undefined }));
    } else {
      setErrors(prev => ({ ...prev, upload: 'Please select a valid video file' }));
    }
  };

  const handleUrlChange = (value: string) => {
    setFormData(prev => ({ ...prev, url: value }));
    if (value.includes('tiktok.com') || value.includes('youtube.com/shorts')) {
      setFormData(prev => ({
        ...prev,
        preview: {
          type: 'url',
          url: value,
          platform: value.includes('tiktok.com') ? 'TikTok' : 'YouTube Shorts'
        }
      }));
      setErrors(prev => ({ ...prev, upload: undefined }));
    }
  };

  const toggleClipType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      clipTypes: prev.clipTypes.includes(type)
        ? prev.clipTypes.filter(t => t !== type)
        : [...prev.clipTypes, type]
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Check upload
    if (formData.uploadType === 'file' && !formData.file) {
      newErrors.upload = 'Please upload a video file';
    } else if (formData.uploadType === 'url' && !formData.url.trim()) {
      newErrors.upload = 'Please enter a video URL';
    }

    // Check explanation (required)
    if (!formData.explanation.trim()) {
      newErrors.explanation = 'Explanation is required';
    } else if (formData.explanation.trim().length < 20) {
      newErrors.explanation = 'Please provide a more detailed explanation (at least 20 characters)';
    }

    // Check clip types
    if (formData.clipTypes.length === 0) {
      newErrors.clipTypes = 'Please select at least one clip type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      submitData.append('uploadType', formData.uploadType);
      submitData.append('clipTypes', JSON.stringify(formData.clipTypes));
      submitData.append('tags', JSON.stringify(formData.tags));
      submitData.append('explanation', formData.explanation);
      submitData.append('hasSegmenting', formData.hasSegmenting);
      submitData.append('streamerAttribution', formData.streamerAttribution);

      if (formData.uploadType === 'file' && formData.file) {
        submitData.append('file', formData.file);
      } else if (formData.uploadType === 'url') {
        submitData.append('url', formData.url);
      }

      // Make API call to Next.js API route
      const response = await fetch('/api/trainer/submit', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit clip');
      }

      const result = await response.json();
      console.log('Submission successful:', result);

      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          uploadType: 'file',
          file: null,
          url: '',
          clipTypes: [],
          tags: [],
          explanation: '',
          hasSegmenting: '',
          streamerAttribution: '',
          preview: null
        });
        setSubmitSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);

    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearPreview = () => {
    setFormData(prev => ({
      ...prev,
      file: null,
      url: '',
      preview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (submitSuccess) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Successful!</h2>
          <p className="text-gray-600 mb-4">Your clip has been added to the training dataset.</p>
          <div className="animate-pulse text-sm text-gray-500">Resetting form...</div>
        </div>
      </div>
    );
  }

  return (
    // <div>
    //     <Header 
    //       darkMode={darkMode}
    //       onToggleDarkMode={toggleDarkMode}
    //     />
    //         <main>
    //             <div className="container">
    //                 <div className="main-content">
    //                     <Sidebar/>

                        <div className="left-content d-flex flex-column">

                            <div className="clip-review-header">
                                <h2 className="page-title">Trainer</h2>
                            </div>  

                            <div className="clip-trainer-container">
                              {/* Header */}
                              <div className="clip-trainer-header">
                                  <h1 className="clip-trainer-title">🎯 Clip Trainer Tool</h1>
                                  <p className="clip-trainer-description">Upload and annotate clips for AI training. Focus on quality labeling over volume.</p>
                                  
                                  <div className="clip-trainer-badges">
                                      <div className="badge-green">✅ High-performing ClipNET clips</div>
                                      <div className="badge-red">✅ Rejected ClipNET clips</div>
                                      <div className="badge-purple">✅ External viral TikToks/Shorts</div>
                                      <div className="badge-blue">✅ Segment-stitched narratives</div>
                                      <div className="badge-yellow">✅ Community voted clips</div>
                                  </div>
                              </div>

                              {/* Form */}
                              <form onSubmit={handleSubmit} className="clip-trainer-form">
                                  {/* Upload Section */}
                                  <div>
                                      <label className="form-label">
                                          Clip Upload <span className="required-asterisk">*</span>
                                      </label>
                                      
                                      {/* Upload Type Toggle */}
                                      <div className="upload-toggle">
                                          <button
                                              type="button"
                                              onClick={() => setFormData(prev => ({ ...prev, uploadType: 'file', url: '', preview: null }))}
                                              className={`toggle-button ${formData.uploadType === 'file' ? 'toggle-button-active' : 'toggle-button-inactive'}`}
                                          >
                                              Upload File
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => setFormData(prev => ({ ...prev, uploadType: 'url', file: null, preview: null }))}
                                              className={`toggle-button ${formData.uploadType === 'url' ? 'toggle-button-active' : 'toggle-button-inactive'}`}
                                          >
                                              Paste URL
                                          </button>
                                      </div>

                                      {/* File Upload */}
                                      {formData.uploadType === 'file' && (
                                          <div className="file-upload-area">
                                              <div className="file-upload-content">
                                                  <Upload className="upload-icon" />
                                                  <div className="mt-4">
                                                      <label htmlFor="file-upload" className="cursor-pointer">
                                                          <span className="file-upload-text">
                                                              Drop MP4 file here or click to browse
                                                          </span>
                                                          <input
                                                              id="file-upload"
                                                              ref={fileInputRef}
                                                              name="file-upload"
                                                              type="file"
                                                              accept="video/*"
                                                              className="file-input"
                                                              onChange={handleFileUpload}
                                                          />
                                                      </label>
                                                  </div>
                                              </div>
                                          </div>
                                      )}

                                      {/* URL Input */}
                                      {formData.uploadType === 'url' && (
                                          <div>
                                              <input
                                                  type="url"
                                                  value={formData.url}
                                                  onChange={(e) => handleUrlChange(e.target.value)}
                                                  placeholder="https://www.tiktok.com/@user/video/... or https://youtube.com/shorts/..."
                                                  className="url-input"
                                              />
                                          </div>
                                      )}

                                      {errors.upload && (
                                          <p className="error-message">
                                              <AlertCircle className="error-icon" />
                                              {errors.upload}
                                          </p>
                                      )}

                                      {/* Preview */}
                                      {formData.preview && (
                                          <div className="preview-container">
                                              <div className="preview-content">
                                                  <Video className="preview-icon" />
                                                  <div>
                                                      {formData.preview.type === 'file' ? (
                                                          <>
                                                              <p className="preview-name">{formData.preview.name}</p>
                                                              <p className="preview-size">{formData.preview.size}</p>
                                                          </>
                                                      ) : (
                                                          <>
                                                              <p className="preview-platform">{formData.preview.platform} URL</p>
                                                              <p className="preview-url">{formData.preview.url}</p>
                                                          </>
                                                      )}
                                                  </div>
                                              </div>
                                              <button
                                                  type="button"
                                                  onClick={clearPreview}
                                                  className="preview-close"
                                              >
                                                  <X className="close-icon" />
                                              </button>
                                          </div>
                                      )}
                                  </div>

                                  {/* Clip Types */}
                                  <div>
                                      <label className="form-label">
                                          Clip Types <span className="required-asterisk">*</span>
                                      </label>
                                      <div className="grid-4-cols-lg">
                                          {clipTypes.map((type) => (
                                              <button
                                                  key={type}
                                                  type="button"
                                                  onClick={() => toggleClipType(type)}
                                                  className={`clip-type-button ${formData.clipTypes.includes(type) ? 'clip-type-button-active' : ''}`}
                                              >
                                                  {type.replace(/_/g, ' ')}
                                              </button>
                                          ))}
                                      </div>
                                      {errors.clipTypes && (
                                          <p className="error-message">
                                              <AlertCircle className="error-icon" />
                                              {errors.clipTypes}
                                          </p>
                                      )}
                                  </div>

                                  {/* Tags */}
                                  <div>
                                      <label className="form-label">
                                          Tags (Multi-select)
                                      </label>
                                      <div className="grid-4-cols-lg">
                                          {availableTags.map((tag) => (
                                              <button
                                                  key={tag}
                                                  type="button"
                                                  onClick={() => toggleTag(tag)}
                                                  className={`tag-button ${formData.tags.includes(tag) ? 'tag-button-active' : ''}`}
                                              >
                                                  {tag.replace(/_/g, ' ')}
                                              </button>
                                          ))}
                                      </div>
                                  </div>

                                  {/* Explanation */}
                                  <div>
                                      <label className="form-label">
                                          Why did this clip perform well? <span className="required-asterisk">*</span>
                                      </label>
                                      <textarea
                                          value={formData.explanation}
                                          onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                                          placeholder="Provide detailed analysis: What made this clip engaging? What elements contributed to its success? Include specifics about timing, content, style, etc."
                                          rows={4}
                                          className={`textarea ${errors.explanation ? 'textarea-error' : ''}`}
                                      />
                                      <div className="character-count">
                                          <span>{formData.explanation.length} characters</span>
                                          <span>Minimum 20 characters required</span>
                                      </div>
                                      {errors.explanation && (
                                          <p className="error-message">
                                              <AlertCircle className="error-icon" />
                                              {errors.explanation}
                                          </p>
                                      )}
                                  </div>

                                  {/* Contains Segmenting/Stitching */}
                                  <div>
                                      <label className="form-label">
                                          Contains Segmenting/Stitching
                                      </label>
                                      <select
                                          value={formData.hasSegmenting}
                                          onChange={(e) => setFormData(prev => ({ ...prev, hasSegmenting: e.target.value }))}
                                          className="select"
                                      >
                                          <option value="">Select...</option>
                                          <option value="yes">Yes</option>
                                          <option value="no">No</option>
                                      </select>
                                  </div>

                                  {/* Streamer Attribution */}
                                  <div>
                                      <label className="form-label">
                                          Streamer Attribution (Optional)
                                      </label>
                                      <select
                                          value={formData.streamerAttribution}
                                          onChange={(e) => setFormData(prev => ({ ...prev, streamerAttribution: e.target.value }))}
                                          className="select"
                                      >
                                          <option value="">Select streamer...</option>
                                          {streamers.map((streamer) => (
                                              <option key={streamer} value={streamer}>{streamer}</option>
                                          ))}
                                      </select>
                                  </div>

                                  {/* Error Message */}
                                  {errors.submit && (
                                      <div className="error-box">
                                          <p className="error-message">
                                              <AlertCircle className="mr-2" />
                                              {errors.submit}
                                          </p>
                                      </div>
                                  )}

                                  {/* Submit Button */}
                                  <div>
                                      <button
                                          type="submit"
                                          disabled={isSubmitting}
                                          className={`submit-button ${isSubmitting ? 'submit-button-disabled' : 'submit-button-normal'}`}
                                      >
                                          {isSubmitting ? (
                                              <span className="loading-container">
                                                  <div className="loading-spinner"></div>
                                                  Submitting...
                                              </span>
                                          ) : (
                                              'Submit to Training Dataset'
                                          )}
                                      </button>
                                  </div>
                              </form>
                            </div>

                        </div>

    //                 </div>
    //             </div>
    //         </main>
    // </div>
  )
}