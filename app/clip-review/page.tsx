'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react';
import { Settings, Zap, Check, AlertCircle, User, Play, Edit3, Save, Sparkles, Shield, TrendingUp } from 'lucide-react';

import '../styles/dashboard.css';

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function ClipReview() {
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

  const [activeTab, setActiveTab] = useState("generate");
  
  type ContentType = {
  title: string;
  description: string;
  safety_flags: string[];
};

  const [isGenerating, setIsGenerating] = useState(false);
  // const [generatedContent, setGeneratedContent] = useState(null);
  const [generatedContent, setGeneratedContent] = useState<ContentType | null>(null);
  type ToneType = 'hype' | 'meme' | 'professional';
  const [profile, setProfile] = useState<{
    tone: ToneType;
    focus: string;
    quotes: boolean;
    profanity: string;
  }>({
    tone: 'hype',
    focus: 'balanced',
    quotes: true,
    profanity: 'bleep'
  });

  const streamerProfiles = {
    hype: {
      name: "HypeGamer_X",
      tone: "High energy, lots of caps, exclamation marks",
      sample: "INSANE CLUTCH PLAY!! YOU WON'T BELIEVE THIS!"
    },
    meme: {
      name: "MemeLord420",
      tone: "Internet slang, trendy references, casual",
      sample: "this clip hits different ngl 💀"
    },
    professional: {
      name: "ProStreamer",
      tone: "Clean, informative, strategic focus",
      sample: "Advanced positioning strategy showcased in ranked gameplay"
    }
  };

  const mockClipData = {
    transcript: "Oh my god, did you see that headshot? That was absolutely insane! I can't believe I hit that through smoke!",
    visualTags: ["headshot", "smoke_grenade", "celebration", "first_person_shooter"],
    duration: "15s",
    game: "Counter-Strike 2"
  };

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const contents = {
        hype: {
          title: "IMPOSSIBLE SMOKE HEADSHOT!! 🎯 YOU WON'T BELIEVE YOUR EYES!",
          description: "GUYS THIS WAS ABSOLUTELY MENTAL!! Hit the most INSANE headshot through smoke that left me speechless! 🔥 The celebration says it all - pure skill meets lucky timing! Drop a 🎯 if you think this was clean! #Clutch #Headshot #Insane",
          safety_flags: []
        },
        meme: {
          title: "smoke diff hits different 💀",
          description: "pov: you're just vibing and hit the most random headshot through smoke lmaooo the celebration was everything 😭 chat went WILD. this is why we don't ff at 15 💯 #smokediff #builddifferent",
          safety_flags: []
        },
        professional: {
          title: "Tactical Smoke Elimination: Advanced Positioning Analysis",
          description: "Demonstrating effective smoke utility usage and crosshair placement in Counter-Strike 2. This clip showcases proper angle holding and the importance of maintaining composure during high-pressure situations. Key learning points: smoke positioning awareness and pre-aim fundamentals.",
          safety_flags: []
        }
      };
      
      setGeneratedContent(contents[profile.tone as keyof typeof contents]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    // <div>
    //   <Header 
    //       darkMode={darkMode}
    //       onToggleDarkMode={toggleDarkMode}
    //     />

    //   <main>
    //     <div className="container">
    //       <div className="main-content">
    //         <Sidebar/>

            <div className="left-content d-flex flex-column">

              <div className="clipReview-container">

                <div className="content-wrapper">
                  {/* Tab Navigation */}
                  <div className="tab-navigation">
                    {[
                      { id: "generate", label: "Generate Content", icon: Sparkles },
                      { id: "profile", label: "Personality Profile", icon: User },
                      { id: "review", label: "Review & Edit", icon: Edit3 },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                      >
                        <tab.icon className="tab-icon" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                
                  {/* Content Generation */}
                  {activeTab === 'generate' && (
                    <div>
                      <div className="content-card">
                        <h2 className="clipReview-header">
                          <Play className="header-icon blue" />
                          <span className="header-text">Clip Review</span>
                        </h2>
                        
                        <div className="space-y-4">
                          <div className="video-container">
                            <video className="video-element" controls>
                              <source src="/assets/videos/clip1.mp4" type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h4 className="form-label">Transcript</h4>
                              <div className="transcript-box">
                                "{mockClipData.transcript}"
                              </div>
                            </div>

                            <div>
                              <h4 className="form-label">Visual Tags</h4>
                              <div className="tag-container">
                                {mockClipData.visualTags.map(tag => (
                                  <span key={tag} className="tag">
                                    {tag.replace('_', ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={generateContent}
                            disabled={isGenerating}
                            className="primary-button"
                          >
                            {isGenerating ? (
                              <>
                                <div className="loading-spinner"></div>
                                <span>Generating with Gemini...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="tab-icon" />
                                <span>Generate Content</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="content-card mt-5">
                        <h2 className="clipReview-header">
                          <Zap className="header-icon yellow" />
                          <span className="header-text">AI Generated Content</span>
                        </h2>

                        {!generatedContent && !isGenerating && (
                          <div className="empty-state">
                            <Sparkles className="empty-state-icon" />
                            <p>Click "Generate Content" to create titles and descriptions based on your personality profile.</p>
                          </div>
                        )}

                        {isGenerating && (
                          <div className="space-y-4">
                            <div className="loading-skeleton">
                              <div className="skeleton-line"></div>
                              <div className="skeleton-line w-3-4"></div>
                              <div className="skeleton-small"></div>
                              <div className="skeleton-small"></div>
                              <div className="skeleton-small w-2-3"></div>
                            </div>
                          </div>
                        )}

                        {generatedContent && (
                          <div className="space-y-6">
                            <div className="generated-title-card">
                              <div className="card-header">
                                <h4 className="card-title">Generated Title</h4>
                                <div className="card-badge">
                                  <Check className="badge-icon" />
                                  Gemini AI
                                </div>
                              </div>
                              <div className="card-content">{generatedContent.title}</div>
                            </div>

                            <div className="generated-description-card">
                              <div className="card-header">
                                <h4 className="card-title blue">Generated Description</h4>
                                <div className="card-badge blue">
                                  <Check className="badge-icon" />
                                  Gemini AI
                                </div>
                              </div>
                              <div className="card-content small">{generatedContent.description}</div>
                            </div>

                            <div className="safety-indicator">
                              <Shield className="safety-icon" />
                              <span>Content passed safety validation</span>
                              <span className="safety-details">• No flags detected</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Profile Configuration */}
                  {activeTab === 'profile' && (
                    <div>
                      <div className="content-card">
                        <h2 className="clipReview-header">
                          <Settings className="header-icon purple" />
                          <span className="header-text">Personality Configuration</span>
                        </h2>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="form-label mb-3">Preferred Tone</label>
                            <div className="profile-grid">  
                              {Object.entries(streamerProfiles).map(([key, data]) => (
                              <button
                                key={key}
                                onClick={() => setProfile({ ...profile, tone: key as ToneType })} // type assertion
                                className={`profile-option ${profile.tone === key ? 'active' : ''}`}
                              >
                                <div className="profile-option-title">{key}</div>
                                <div className="profile-option-tone">{data.tone}</div>
                                <div className="profile-option-sample">"{data.sample}"</div>
                              </button>
                            ))}

                            </div>
                          </div>

                          <div>
                            <label className="form-label mb-3">Content Focus</label>
                            <select 
                              value={profile.focus}
                              onChange={(e) => setProfile({...profile, focus: e.target.value})}
                              className="select-dropdown"
                            >
                              <option value="facecam">Facecam Heavy</option>
                              <option value="gameplay">Gameplay Focus</option>
                              <option value="balanced">Balanced Mix</option>
                            </select>
                          </div>

                          <div className="toggle-container">
                            <div>
                              <div className="toggle-label">Highlight Quotes</div>
                              <div className="toggle-description">Include streamer reactions</div>
                            </div>
                            <button
                              onClick={() => setProfile({...profile, quotes: !profile.quotes})}
                              className={`toggle-switch ${profile.quotes ? 'on' : 'off'}`}
                            >
                              <div className={`toggle-slider ${profile.quotes ? 'on' : 'off'}`}></div>
                            </button>
                          </div>

                          <div>
                            <label className="form-label mb-3">Profanity Handling</label>
                            <div className="button-group">
                              {['bleep', 'disable'].map(option => (
                                <button
                                  key={option}
                                  onClick={() => setProfile({...profile, profanity: option})}
                                  className={`option-button ${profile.profanity === option ? 'active' : ''}`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="content-card mt-5">
                        <h2 className="clipReview-header">
                          <TrendingUp className="header-icon green" />
                          <span className="header-text">Profile Preview</span>
                        </h2>
                        
                        <div className="space-y-4">
                          <div className="preview-card">
                            <h3 className="preview-title">Current Configuration</h3>
                            <div className="preview-grid">
                              <div className="preview-row">
                                <span className="preview-label">Tone:</span>
                                <span className="preview-value">{profile.tone}</span>
                              </div>
                              <div className="preview-row">
                                <span className="preview-label">Focus:</span>
                                <span className="preview-value">{profile.focus}</span>
                              </div>
                              <div className="preview-row">
                                <span className="preview-label">Quotes:</span>
                                <span className="preview-value">{profile.quotes ? 'Enabled' : 'Disabled'}</span>
                              </div>
                              <div className="preview-row">
                                <span className="preview-label">Profanity:</span>
                                <span className="preview-value">{profile.profanity}</span>
                              </div>
                            </div>
                          </div>

                          <div className="access-control-card">
                            <h4 className="access-control-title">⚠️ Access Control</h4>
                            <div className="access-control-content space-y-1">
                              <div className="access-control-item">
                                <Check className="access-check-icon" />
                                Creator tier active 
                              </div>
                              <div className="access-control-item">
                                <Check className="access-check-icon" />
                                Gemini AI enabled
                              </div>
                              <div className="access-note">
                                Phase 2: Token usage limits will apply with premium models
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                

                  {/* Review & Edit */}
                  {activeTab === 'review' && generatedContent && (
                    <div className="max-w-4xl">
                      <div className="content-card">
                        <h2 className="clipReview-header">
                          <Edit3 className="header-icon orange" />
                          <span className="header-text">Review & Edit Content</span>
                        </h2>

                        <div className="space-y-6">
                          <div>
                            <label className="form-label">Title</label>
                            <textarea
                              className="textarea-input textarea-rows-2"
                              defaultValue={generatedContent.title}
                            />
                          </div>

                          <div>
                            <label className="form-label">Description</label>
                            <textarea
                              className="textarea-input textarea-rows-6"
                              defaultValue={generatedContent.description}
                            />
                          </div>

                          <div className="warning-alert">
                            <div className="warning-content">
                              <AlertCircle className="warning-icon" />
                              <span className="warning-text">Content generated using your {profile.tone} personality profile</span>
                            </div>
                          </div>

                          <div className="action-buttons">
                            <button className="approve-button">
                              <Save className="tab-icon" />
                              <span>Approve & Publish</span>
                            </button>
                            <button className="draft-button">
                              Save as Draft
                            </button>
                            <button className="regenerate-button">
                              Regenerate
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* API Status Footer */}
                  <div className="api-status-footer">
                    <div className="status-row">
                      <div className="status-left">
                        <span>API Status: </span>
                                    <div className="status-indicator">
                          <div className="status-dot"></div>
                          <span className="status-text">Operational</span>
                        </div>
                      </div>
                      <div className="status-right">
                        Fallback : Safe defaults enabled • Trace ID: CN-2024
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

    //       </div>
    //     </div>
    //   </main>
    // </div>
  )
}