'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, Edit3, Play, X } from 'lucide-react';

import '../styles/dashboard.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

// Define types for better TypeScript support
type TraitType = 'patient' | 'analytical' | 'encouraging' | 'witty' | 'professional' | 'casual' | 'educational' | 'entertaining';

interface CustomTrait {
  id: number;
  trait: string;
  enabled: boolean;
}

interface TraitToggleProps {
  trait: string;
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}

interface CustomTraitItemProps {
  trait: CustomTrait;
}

export default function MyAi() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)

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

  const [clipNetEnabled, setClipNetEnabled] = useState(false);
  const [featureX, setFeatureX] = useState(false);
  const [clipBotEnabled, setClipBotEnabled] = useState(false);
  const [clipBotValue, setClipBotValue] = useState(20);
  const [featureY, setFeatureY] = useState(false);
  const [voiceBlendEnabled, setVoiceBlendEnabled] = useState(false);
  const [voiceBlendValue, setVoiceBlendValue] = useState(80);
  const [featureY2, setFeatureY2] = useState(false);
  const [messageFrequency, setMessageFrequency] = useState('medium');

  //profile code
  const [humorLevel, setHumorLevel] = useState(65);
  const [formalityLevel, setFormalityLevel] = useState(40);
  const [empathyLevel, setEmpathyLevel] = useState(80);
  const [creativityLevel, setCreativityLevel] = useState(70);
  const [enthusiasm, setEnthusiasm] = useState(75);
  const [directness, setDirectness] = useState(55);
  const [supportiveness, setSupportiveness] = useState(85);

  // baki data ek object ma
  const [communicationStyle, setCommunicationStyle] = useState('Friendly');
  const [responseLength, setResponseLength] = useState('Medium');
  const [traits, setTraits] = useState<Record<TraitType, boolean>>({
    patient: true,
    analytical: false,
    encouraging: true,
    witty: true,
    professional: false,
    casual: true,
    educational: true,
    entertaining: false,
  });
  const [customTraits, setCustomTraits] = useState<CustomTrait[]>([
    { id: 1, trait: 'Gaming-focused', enabled: true },
    { id: 2, trait: 'Tech-savvy', enabled: true },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [newTraitInput, setNewTraitInput] = useState('');

  // 🔹 toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing && hasChanges) {
      // cancel karva pachi reset logic jo hoy to add karo
    }
  };

  // 🔹 save karva nu dummy logic
  const handleSave = async () => {
    const profileData = {
      communicationStyle,
      responseLength,
      humorLevel,
      formalityLevel,
      empathyLevel,
      creativityLevel,
      enthusiasm,
      directness,
      supportiveness,
      traits,
      customTraits,
    };

    console.log('Saving personality data:', profileData);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setHasChanges(false);
      setIsEditing(false);
      alert('Personality profile saved successfully!');
    } catch (error) {
      console.error('Failed to save personality profile:', error);
      alert('Failed to save personality profile. Please try again.');
    }
  };

  // 🔹 trait toggle
  const toggleTrait = (trait: TraitType) => {
    if (!isEditing) return;

    setTraits((prev) => ({
      ...prev,
      [trait]: !prev[trait],
    }));
    setHasChanges(true);
  };

  // 🔹 custom trait toggle
  const toggleCustomTrait = (id: number) => {
    if (!isEditing) return;
    setCustomTraits((prev) =>
      prev.map((trait) =>
        trait.id === id ? { ...trait, enabled: !trait.enabled } : trait
      )
    );
    setHasChanges(true);
  };

  // 🔹 add trait
  const addCustomTrait = () => {
    const traitName = newTraitInput.trim();
    if (traitName) {
      const newTrait: CustomTrait = {
        id: Date.now(),
        trait: traitName,
        enabled: true,
      };
      setCustomTraits((prev) => [...prev, newTrait]);
      setNewTraitInput('');
      setHasChanges(true);
    }
  };

  // 🔹 remove trait
  const removeCustomTrait = (id: number) => {
    setCustomTraits((prev) => prev.filter((trait) => trait.id !== id));
    setHasChanges(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addCustomTrait();
    }
  };

  // 🔹 trait toggle component
  const TraitToggle: React.FC<TraitToggleProps> = ({ trait, enabled, onChange, disabled = false }) => (
    <div className="toggle-container" id="traits">
      <span className="toggle-label">
        {trait.charAt(0).toUpperCase() + trait.slice(1)}
      </span>
      <button
        className={`toggle ${enabled ? 'enabled' : ''} ${
          disabled ? 'disabled' : ''
        }`}
        disabled={disabled}
        onClick={onChange}
      >
        <span className="toggle-thumb"></span>
      </button>
    </div>
  );

  const CustomTraitItem: React.FC<CustomTraitItemProps> = ({ trait }) => (
    <div className="custom-trait-item">
      <div className="custom-trait-left">
        <TraitToggle
          trait={trait.trait}
          enabled={trait.enabled}
          onChange={() => toggleCustomTrait(trait.id)}
          disabled={!isEditing}
        />
      </div>
      <button
        className="remove-btn"
        style={{ display: isEditing ? 'block' : 'none' }}
        onClick={() => removeCustomTrait(trait.id)}
      >
        Remove
      </button>
    </div>
  );

  //new code
  const [selectedCategories, setSelectedCategories] = useState(['gaming_highlights', 'funny_moments', 'clutch_plays']);
  const [perspective, setPerspective] = useState('first');
  const [tone, setTone] = useState('casual');
  const [instructions, setInstructions] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const categories = [
    { id: 'gaming_highlights', icon: '🎮', label: 'Gaming Highlights' },
    { id: 'funny_moments', icon: '😂', label: 'Funny Moments' },
    { id: 'educational', icon: '🎓', label: 'Educational Content' },
    { id: 'chat_interactions', icon: '💬', label: 'Chat Interactions' },
    { id: 'clutch_plays', icon: '⚡', label: 'Clutch Plays' },
    { id: 'epic_fails', icon: '🤦', label: 'Epic Fails' }
  ];

  const clips = [
    {
      id: 1,
      title: 'Epic 1v4 clutch saves the round!',
      tags: ['Gaming Highlights', 'Clutch Plays'],
      views: '1.2K',
      time: '2 hours ago',
      icon: '🎮'
    },
    {
      id: 2,
      title: 'My reaction to chat\'s terrible advice',
      tags: ['Funny Moments', 'Chat Interactions'],
      views: '892',
      time: '5 hours ago',
      icon: '😂'
    },
    {
      id: 3,
      title: 'Frame-perfect combo execution',
      tags: ['Gaming Highlights'],
      views: '2.1K',
      time: '1 day ago',
      icon: '⚡'
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFeedback = (type: string) => {
    setFeedbackType(type);
    setShowFeedbackModal(true);
  };

  const submitFeedback = () => {
    if (selectedReason) {
      console.log('Feedback submitted:', { type: feedbackType, reason: selectedReason });
      setShowFeedbackModal(false);
      setSelectedReason('');
    }
  };
   
  const [feedbackReason, setFeedbackReason] = useState("tone_off");
  
  return (
    // <div>
    //     <Header 
    //       darkMode={darkMode}
    //       onToggleDarkMode={toggleDarkMode}
    //     />
    //     <main>
    //         <div className="container">
    //             <div className="main-content">
    //                 <Sidebar/>

                    <div className="left-content d-flex flex-column">
                        <div className="clip-review-header">
                            <h2 className="page-title">My AI</h2>
                        </div>
                        
                        <section className="section">
                            <h3 className="section-title">ClipNET</h3>
                            <div className="card">
                            <div className="card-row">
                                <span>Enable ClipNET</span>
                                <label className="switch">
                                <input 
                                    type="checkbox" 
                                    checked={clipNetEnabled}
                                    onChange={(e) => setClipNetEnabled(e.target.checked)}
                                />
                                <span className="slider"></span>
                                </label>
                            </div>
                            <hr />
                            <div className="card-row">
                                <span>Feature X</span>
                                <label className="switch">
                                <input 
                                    type="checkbox" 
                                    checked={featureX}
                                    onChange={(e) => setFeatureX(e.target.checked)}
                                />
                                <span className="slider"></span>
                                </label>
                            </div>
                            </div>
                        </section>

                        <section className="section">
                            <h3 className="section-title">ClipBOT</h3>
                            <div className="card">
                            <div className="card-row">
                                <span>Enable ClipBOT</span>
                                <label className="switch">
                                <input 
                                    type="checkbox" 
                                    checked={clipBotEnabled}
                                    onChange={(e) => setClipBotEnabled(e.target.checked)}
                                />
                                <span className="slider"></span>    
                                </label>
                            </div>
                            <div className="card-row slider-row">
                                <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={clipBotValue}
                                onChange={(e) => setClipBotValue(Number(e.target.value))}
                                />
                                <span className="slider-value">{clipBotValue}</span>
                            </div>
                            <div className="card-row">
                                <span>Feature Y</span>
                                <label className="switch">
                                <input 
                                    type="checkbox" 
                                    checked={featureY}
                                    onChange={(e) => setFeatureY(e.target.checked)}
                                />
                                <span className="slider"></span>
                                </label>
                            </div>
                            </div>
                        </section>

                        <section className="section">
                            <h3 className="section-title">Voice Blend</h3>
                            <div className="card">
                            <div className="card-row">
                                <span>Enable Voice Blend</span>
                                <label className="switch">
                                <input 
                                    type="checkbox" 
                                    checked={voiceBlendEnabled}
                                    onChange={(e) => setVoiceBlendEnabled(e.target.checked)}
                                />
                                <span className="slider"></span>
                                </label>
                            </div>
                            <div className="card-row slider-row">
                                <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={voiceBlendValue}
                                onChange={(e) => setVoiceBlendValue(Number(e.target.value))}
                                />
                                <span className="slider-value">{voiceBlendValue}</span>
                            </div>
                            <div className="card-row">
                                <span>Feature Y</span>
                                <label className="switch">
                                <input 
                                    type="checkbox" 
                                    checked={featureY2}
                                    onChange={(e) => setFeatureY2(e.target.checked)}
                                />
                                <span className="slider"></span>
                                </label>
                            </div>
                            </div>
                        </section>

                        <section className="section">
                            <h3 className="section-title">Message Frequency</h3>
                            <div className="card">
                            <div className="card-row">
                                <span>Select Message Frequency</span>
                                <div className="custom-select">
                                <select 
                                    id="messageFrequency"
                                    value={messageFrequency}
                                    onChange={(e) => setMessageFrequency(e.target.value)}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                </div>
                            </div>
                            </div>
                        </section>

                    
                        {/* //Personality profile */}

                        <div className="container">
                            {/* Header */}
                            <div className="header">
                                <div className="header-left">
                                <div className="icon-container">
                                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div className="header-title">Personality Profile</div>
                                    <div className="header-subtitle">
                                    Configure your AI's long-term personality traits and communication style
                                    </div>
                                </div>
                                </div>
                                <div className="header-right">
                                <span className={`unsaved-badge ${!hasChanges ? 'hidden' : ''}`}>
                                    Unsaved changes
                                </span>
                                <button className={`btn btn-edit ${isEditing ? 'editing' : ''}`} onClick={toggleEditMode}>
                                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                                </button>
                                <button
                                    className={`btn btn-save ${(!isEditing || !hasChanges) ? 'hidden' : ''}`}
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                                </div>
                            </div>

                            <div className="grid">
                                {/* Communication Style Section */}
                                <div>
                                <div className="section-header">
                                    <h3 className="section-title">Communication Style</h3>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Primary Communication Style</label>
                                    <select
                                    className="form-select"
                                    disabled={!isEditing}
                                    value={communicationStyle}
                                    onChange={(e) => {
                                        setCommunicationStyle(e.target.value);
                                        setHasChanges(true);
                                    }}
                                    >
                                    <option value="Friendly">Friendly</option>
                                    <option value="Professional">Professional</option>
                                    <option value="Casual">Casual</option>
                                    <option value="Formal">Formal</option>
                                    <option value="Enthusiastic">Enthusiastic</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Response Length Preference</label>
                                    <select
                                    className="form-select"
                                    disabled={!isEditing}
                                    value={responseLength}
                                    onChange={(e) => {
                                        setResponseLength(e.target.value);
                                        setHasChanges(true);
                                    }}
                                    >
                                    <option value="Brief">Brief</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Detailed">Detailed</option>
                                    <option value="Comprehensive">Comprehensive</option>
                                    </select>
                                </div>

                                {/* Sliders */}
                                <div className="slider-container">
                                    <div className="slider-header">
                                    <span className="slider-label">Humor Level</span>
                                    <span className="slider-value">{humorLevel}</span>
                                    </div>
                                    <input
                                    id='range'
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={humorLevel}
                                    disabled={!isEditing}
                                    onChange={(e) => { setHumorLevel(Number(e.target.value)); setHasChanges(true); }}
                                    />
                                </div>

                                <div className="slider-container">
                                    <div className="slider-header">
                                    <span className="slider-label">Formality Level</span>
                                    <span className="slider-value">{formalityLevel}</span>
                                    </div>
                                    <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formalityLevel}
                                    disabled={!isEditing}
                                    onChange={(e) => { setFormalityLevel(Number(e.target.value)); setHasChanges(true); }}
                                    id='range'
                                    />
                                </div>
                                </div>

                                {/* Personality Traits Section */}
                                <div>
                                <div className="section-header">
                                    <h3 className="section-title">Personality Dimensions</h3>
                                </div>

                                <div className="slider-container">
                                    <div className="slider-header">
                                    <span className="slider-label">Empathy Level</span>
                                    <span className="slider-value">{empathyLevel}</span>
                                    </div>
                                    <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={empathyLevel}
                                    disabled={!isEditing}
                                    onChange={(e) => { setEmpathyLevel(Number(e.target.value)); setHasChanges(true); }}
                                    id='range'
                                    />
                                </div>

                                <div className="slider-container">
                                    <div className="slider-header">
                                    <span className="slider-label">Creativity Level</span>
                                    <span className="slider-value">{creativityLevel}</span>
                                    </div>
                                    <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={creativityLevel}
                                    disabled={!isEditing}
                                    onChange={(e) => { setCreativityLevel(Number(e.target.value)); setHasChanges(true); }}
                                    id='range'
                                    />
                                </div>

                                <div className="slider-container">
                                    <div className="slider-header">
                                    <span className="slider-label">Enthusiasm</span>
                                    <span className="slider-value">{enthusiasm}</span>
                                    </div>
                                    <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={enthusiasm}
                                    disabled={!isEditing}
                                    onChange={(e) => { setEnthusiasm(Number(e.target.value)); setHasChanges(true); }}
                                    id='range'
                                    />
                                </div>

                                <div className="slider-container">
                                    <div className="slider-header">
                                    <span className="slider-label">Directness</span>
                                    <span className="slider-value">{directness}</span>
                                    </div>
                                    <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={directness}
                                    disabled={!isEditing}
                                    onChange={(e) => { setDirectness(Number(e.target.value)); setHasChanges(true); }}
                                    id='range'
                                    />
                                </div>

                                <div className="slider-container">
                                    <div className="slider-header">
                                    <span className="slider-label">Supportiveness</span>
                                    <span className="slider-value">{supportiveness}</span>
                                    </div>
                                    <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={supportiveness}
                                    disabled={!isEditing}
                                    onChange={(e) => { setSupportiveness(Number(e.target.value)); setHasChanges(true); }}
                                    id='range'
                                    />
                                </div>
                                </div>
                            </div>

                            {/* Personality Traits Toggles */}
                            <div className="traits-section">
                                <h3 className="section-title" style={{ marginBottom: '16px' }}>
                                Core Personality Traits
                                </h3>
                                <div className="traits-grid">
                                {Object.entries(traits).map(([trait, enabled]) => (
                                    <TraitToggle
                                    key={trait}
                                    trait={trait}
                                    enabled={enabled}
                                    onChange={() => toggleTrait(trait as TraitType)}
                                    disabled={!isEditing}
                                    />
                                ))}
                                </div>
                            </div>

                            {/* Custom Traits */}
                            <div className="custom-traits-section">
                                <h3 className="section-title" style={{ marginBottom: '16px' }}>
                                Custom Traits
                                </h3>
                                <div>
                                {customTraits.map((trait) => (
                                    <CustomTraitItem key={trait.id} trait={trait} />
                                ))}
                                </div>

                                <div className={`add-trait-container ${!isEditing ? 'hidden' : ''}`}>
                                <input
                                    type="text"
                                    className="trait-input"
                                    placeholder="Add custom trait..."
                                    value={newTraitInput}
                                    onChange={(e) => setNewTraitInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <button className="add-btn" onClick={addCustomTrait}>
                                    Add
                                </button>
                                </div>
                            </div>

                            {/* Info Note */}
                            <div className="info-note">
                                <p className="info-text">
                                <strong>Note:</strong> These are long-term personality traits that define your AI's core
                                characteristics. These settings are different from short-term preferences and will persist
                                across all interactions.
                                </p>
                            </div>
                        </div>

                        {/* //new code */}
                        <div className="ai-dashboard">
                            <div className="ai-container">
                                {/* <!-- Header --> */}
                                <div className="ai-header">
                                    <h1>🤖 My AI Integration</h1>
                                    <p>Personalized AI that never misses your moments</p>
                                </div>

                                <div className="ai-sections-container">
                                    {/* <!-- Section 1: AI Preferences --> */}
                                    <div className="ai-section">
                                        <h2 className="ai-section-title">
                                            <span className="ai-section-icon">⚙️</span>
                                            My AI Preferences Panel
                                        </h2>
                                        
                                        <div className="ai-gradient-panel">
                                            <div className="ai-panel-header">
                                                <h3 className="ai-subtitle">My AI Preferences</h3>
                                                <p className="ai-description">Configure your AI to never miss the moments you care about</p>
                                            </div>

                                            <div className="ai-categories-section">
                                                <div className="ai-section-header">Categories to Watch For</div>
                                                <div className="ai-category-grid">
                                                    <div className="ai-category-item ai-category-default ai-category-hover">
                                                        <div className="ai-category-overlay"></div>
                                                        <span className="ai-category-icon">🎮</span>
                                                        <div className="ai-category-label">Gaming Highlights</div>
                                                    </div>
                                                    <div className="ai-category-item ai-category-selected">
                                                        <div className="ai-category-overlay"></div>
                                                        <span className="ai-category-icon">😂</span>
                                                        <div className="ai-category-label">Funny Moments</div>
                                                    </div>
                                                    <div className="ai-category-item ai-category-default ai-category-hover">
                                                        <div className="ai-category-overlay"></div>
                                                        <span className="ai-category-icon">🔥</span>
                                                        <div className="ai-category-label">Clutch Plays</div>
                                                    </div>
                                                    <div className="ai-category-item ai-category-default ai-category-hover">
                                                        <div className="ai-category-overlay"></div>
                                                        <span className="ai-category-icon">💬</span>
                                                        <div className="ai-category-label">Chat Interactions</div>
                                                    </div>
                                                    <div className="ai-category-item ai-category-default ai-category-hover">
                                                        <div className="ai-category-overlay"></div>
                                                        <span className="ai-category-icon">🎯</span>
                                                        <div className="ai-category-label">Skill Shots</div>
                                                    </div>
                                                    <div className="ai-category-item ai-category-default ai-category-hover">
                                                        <div className="ai-category-overlay"></div>
                                                        <span className="ai-category-icon">🏆</span>
                                                        <div className="ai-category-label">Victories</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ai-form-grid">
                                                <div className="ai-form-panel">
                                                    <div className="ai-form-title">Perspective</div>
                                                    <div className="ai-radio-options">
                                                        <label className="ai-radio-label">
                                                        <input
                                                            type="radio"
                                                            name="perspective"
                                                            value="first"
                                                            className="ai-radio-input"
                                                            checked={perspective === "first"}
                                                            onChange={(e) => setPerspective(e.target.value)}
                                                        />
                                                        <span>First Person (I, me, my)</span>
                                                        </label>

                                                        <label className="ai-radio-label">
                                                        <input
                                                            type="radio"
                                                            name="perspective"
                                                            value="second"
                                                            className="ai-radio-input"
                                                            checked={perspective === "second"}
                                                            onChange={(e) => setPerspective(e.target.value)}
                                                        />
                                                        <span>Second Person (You, your)</span>
                                                        </label>

                                                        <label className="ai-radio-label">
                                                        <input
                                                            type="radio"
                                                            name="perspective"
                                                            value="third"
                                                            className="ai-radio-input"
                                                            checked={perspective === "third"}
                                                            onChange={(e) => setPerspective(e.target.value)}
                                                        />
                                                        <span>Third Person (Player, streamer)</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="ai-form-panel">
                                                    <div className="ai-form-title">Tone & Style</div>
                                                    <select className="ai-select">
                                                        <option value="casual">Casual & Fun</option>
                                                        <option value="professional">Professional</option>
                                                        <option value="high_energy">High Energy</option>
                                                        <option value="educational">Educational</option>
                                                        <option value="clickbait">Clickbait Style</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="ai-form-panel">
                                                <div className="ai-form-title">Additional Instructions (Optional)</div>
                                                <textarea
                                                    className="ai-textarea"
                                                    rows={3}
                                                    placeholder="e.g., Focus on technical gameplay, mention specific games, avoid spoilers..."
                                                    />
                                            </div>

                                            <button className="ai-button">Save My AI Preferences</button>
                                        </div>

                                        <div className="ai-info-box">
                                            ✨ Interactive Demo: Click categories to select/deselect preferences
                                        </div>
                                    </div>

                                    {/* <!-- Section 2: Dashboard --> */}
                                    <div className="ai-section">
                                        <h2 className="ai-section-title">
                                            <span className="ai-section-icon">📊</span>
                                            Dashboard with Smart Filtering
                                        </h2>
                                        
                                        <div className="ai-gradient-panel">
                                            <div className="ai-dashboard-header">
                                                <h1 className="ai-dashboard-title">My Clips</h1>
                                                <div className="ai-filter-container">
                                                    <label className="ai-filter-label">Filter by Category:</label>
                                                    <select className="ai-select">
                                                        <option value="all">All Clips (127)</option>
                                                        <option value="gaming">Gaming Highlights (45)</option>
                                                        <option value="funny">Funny Moments (32)</option>
                                                        <option value="clutch">Clutch Plays (18)</option>
                                                        <option value="chat">Chat Interactions (12)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="ai-clip-grid">
                                                <div className="ai-clip-card">
                                                    <div className="ai-clip-thumb">
                                                        <div className="ai-clip-thumb-overlay"></div>
                                                        <span>🎮</span>
                                                    </div>
                                                    <div className="ai-clip-content">
                                                        <h3 className="ai-clip-title">Epic 1v4 clutch saves the round!</h3>
                                                        <div className="ai-tag-container">
                                                            <span className="ai-tag">Gaming Highlights</span>
                                                            <span className="ai-tag">Clutch Plays</span>
                                                        </div>
                                                        <div className="ai-clip-meta">2 hours ago • 1.2K views</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="ai-clip-card">
                                                    <div className="ai-clip-thumb">
                                                        <div className="ai-clip-thumb-overlay"></div>
                                                        <span>😂</span>
                                                    </div>
                                                    <div className="ai-clip-content">
                                                        <h3 className="ai-clip-title">When the entire team fails the simplest jump</h3>
                                                        <div className="ai-tag-container">
                                                            <span className="ai-tag">Funny Moments</span>
                                                        </div>
                                                        <div className="ai-clip-meta">5 hours ago • 845 views</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="ai-clip-card">
                                                    <div className="ai-clip-thumb">
                                                        <div className="ai-clip-thumb-overlay"></div>
                                                        <span>💬</span>
                                                    </div>
                                                    <div className="ai-clip-content">
                                                        <h3 className="ai-clip-title">Chat's reaction to the unexpected plot twist</h3>
                                                        <div className="ai-tag-container">
                                                            <span className="ai-tag">Chat Interactions</span>
                                                        </div>
                                                        <div className="ai-clip-meta">1 day ago • 2.4K views</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ai-info-box">
                                            🏷️ Tags are automatically detected based on your AI preferences and displayed as filterable badges
                                        </div>
                                    </div>

                                    {/* <!-- Section 3: Title Feedback --> */}
                                    <div className="ai-section">
                                        <h2 className="ai-section-title">
                                            <span className="ai-section-icon">💬</span>
                                            Title Feedback System
                                        </h2>
                                        
                                        <div className="ai-gradient-panel">
                                            <div className="ai-video-player">
                                                <div className="ai-video-overlay"></div>
                                                <i className="fas fa-play"></i>
                                            </div>

                                            <div className="ai-feedback-section">
                                                <h1 className="ai-feedback-title">
                                                    Epic 1v4 clutch saves the round!
                                                    <button className="ai-feedback-button">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                </h1>
                                                
                                                <div className="ai-feedback-buttons">
                                                    <span>Do you like this title?</span>
                                                    <button className="ai-feedback-button">
                                                        <i className="fas fa-thumbs-up"></i>
                                                    </button>
                                                    <button className="ai-feedback-button">
                                                        <i className="fas fa-thumbs-down"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="ai-tag-container">
                                                <span className="ai-tag">Gaming Highlights</span>
                                                <span className="ai-tag">Clutch Plays</span>
                                            </div>

                                            <div className="ai-description-panel">
                                                <div className="ai-form-title">Description</div>
                                                <p className="ai-description-text">
                                                    Just when all hope seemed lost, I managed to pull off this incredible 1v4 clutch play that completely turned the tide of the match. The precision and timing required for this play was insane!
                                                </p>
                                            </div>
                                        </div>

                                        <div className="ai-info-box">
                                            👆 Click the thumbs down to see the feedback modal in action
                                        </div>
                                    </div>

                                    {/* <!-- Section 4: Feedback Modal Display --> */}
                                    <div className="ai-section">
                                        <h2 className="ai-section-title">
                                            <span className="ai-section-icon">📝</span>
                                            Feedback Collection Modal
                                        </h2>
                                        
                                        <div className="ai-modal-display">
                                            <div className="ai-modal">
                                                <h3 className="ai-modal-title">Why don't you like this title?</h3>
                                                <p className="ai-modal-description">Help us improve AI-generated titles</p>
                                                
                                                <div className="ai-radio-options">
                                                <label className="ai-radio-label">
                                                    <input
                                                    type="radio"
                                                    name="feedbackReason"
                                                    value="too_clickbait"
                                                    className="ai-radio-input"
                                                    checked={feedbackReason === "too_clickbait"}
                                                    onChange={(e) => setFeedbackReason(e.target.value)}
                                                    />
                                                    <span>Too clickbait</span>
                                                </label>

                                                <label className="ai-radio-label">
                                                    <input
                                                    type="radio"
                                                    name="feedbackReason"
                                                    value="tone_off"
                                                    className="ai-radio-input"
                                                    checked={feedbackReason === "tone_off"}
                                                    onChange={(e) => setFeedbackReason(e.target.value)}
                                                    />
                                                    <span>Tone is off / not my style</span>
                                                </label>

                                                <label className="ai-radio-label">
                                                    <input
                                                    type="radio"
                                                    name="feedbackReason"
                                                    value="too_generic"
                                                    className="ai-radio-input"
                                                    checked={feedbackReason === "too_generic"}
                                                    onChange={(e) => setFeedbackReason(e.target.value)}
                                                    />
                                                    <span>Too generic / doesn't match content</span>
                                                </label>

                                                <label className="ai-radio-label">
                                                    <input
                                                    type="radio"
                                                    name="feedbackReason"
                                                    value="doesnt_match_content"
                                                    className="ai-radio-input"
                                                    checked={feedbackReason === "doesnt_match_content"}
                                                    onChange={(e) => setFeedbackReason(e.target.value)}
                                                    />
                                                    <span>Doesn't match the actual content</span>
                                                </label>

                                                <label className="ai-radio-label">
                                                    <input
                                                    type="radio"
                                                    name="feedbackReason"
                                                    value="other"
                                                    className="ai-radio-input"
                                                    checked={feedbackReason === "other"}
                                                    onChange={(e) => setFeedbackReason(e.target.value)}
                                                    />
                                                    <span>Other...</span>
                                                </label>
                                                </div>

                                                <div className="ai-modal-actions">
                                                    <button className="ai-modal-button ai-modal-button-secondary">Cancel</button>
                                                    <button className="ai-modal-button ai-modal-button-primary">Submit Feedback</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ai-info-box">
                                            📊 Feedback data is collected to continuously improve AI title generation quality
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

    //             </div>
    //         </div>
    //     </main>
    // </div>

  )
}