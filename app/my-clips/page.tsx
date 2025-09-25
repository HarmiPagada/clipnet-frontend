'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'

// import './dashboard.css'
import '../styles/dashboard.css';

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

//slider
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useEffect, useState } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export default function DashboardPage() {

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

  //slider - separate states for each slider
  const [currentSlide1, setCurrentSlide1] = useState<number>(1);
  const [currentSlide2, setCurrentSlide2] = useState<number>(1);
  const [currentSlidesPerView1, setCurrentSlidesPerView1] = useState<number>(5);
  const [currentSlidesPerView2, setCurrentSlidesPerView2] = useState<number>(5);
  const totalSlides: number = 9; // Total number of slides

  // Function to calculate total pages based on slides per view
  const getTotalPages = (totalSlides: number, slidesPerView: number): number => {
    return Math.max(1, totalSlides - slidesPerView + 1);
  };

  // Responsive breakpoints for Swiper - use any type to avoid TypeScript conflicts
  const swiperBreakpoints: any = {
    1700: { slidesPerView: 5 },
    1281: { slidesPerView: 4 },
    1081: { slidesPerView: 3 },
    769: { slidesPerView: 2 },
    0: { slidesPerView: 1 },
  };

  // Handle slide change functions with proper typing
  const handleSlideChange1 = (swiper: any) => {
    setCurrentSlide1(swiper.activeIndex + 1);
  };

  const handleSlideChange2 = (swiper: any) => {
    setCurrentSlide2(swiper.activeIndex + 1);
  };

  const handleBreakpoint1 = (swiper: any, breakpointParams: any) => {
    setCurrentSlidesPerView1(breakpointParams.slidesPerView || 5);
  };

  const handleBreakpoint2 = (swiper: any, breakpointParams: any) => {
    setCurrentSlidesPerView2(breakpointParams.slidesPerView || 5);
  };

  return (
    <div>

      <Header 
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />

      <main>
        <div className="container">
          <div className="main-content">
            <Sidebar/>

            <div className="left-content">
                    <div className="clip-review-header">

                      <h2>My Clips</h2>
                        
                      <div className="controls-container">

                        {/* Date Range Picker */}
                        {/* <div className="date-range-picker">
                          <label htmlFor="startDate">From:</label>
                          <input type="date" id="startDate" className="date-input" />
                          <label htmlFor="endDate">To:</label>
                          <input type="date" id="endDate" className="date-input" />
                        </div> */}

                        <div className="sort-dropdown">
                          <select id="clipScoreSort" className="sort-select" defaultValue="">
                            <option value="" hidden>Sort by Date</option>
                            <option value="highest">oldest to newest</option>
                            <option value="lowest"> newest to olderest</option>
                          </select>
                          <span className="sort-icon">
                            <i className="fa fa-caret-down"></i>
                          </span>
                        </div>

                        {/* Existing Sort Dropdown */}
                        <div className="sort-dropdown">
                          <select id="sort" className="sort-select" defaultValue="">
                            <option value="" hidden>Sort by Stream Session</option>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="az">A-Z</option>
                            <option value="za">Z-A</option>
                          </select>
                          <span className="sort-icon">
                            <i className="fa fa-caret-down"></i>
                          </span>
                        </div>

                        {/* New Clip Scores Sort Dropdown */}
                        <div className="sort-dropdown">
                          <select id="clipScoreSort2" className="sort-select" defaultValue="">
                            <option value="" hidden>Sort by Clip Score</option>
                            <option value="highest">Highest to Lowest</option>
                            <option value="lowest">Lowest to Highest</option>
                          </select>
                          <span className="sort-icon">
                            <i className="fa fa-caret-down"></i>
                          </span>
                        </div>

                        {/* Reset/Clear Filters Button */}
                        <button className="reset-btn" id="resetFilters">
                          <i className="fa fa-refresh"></i>
                          Reset Filters
                        </button>

                      </div>

                    </div>

                    <div className="clip-review-list">
                        {/* <!-- Aug 3 Stream --> */}
                        <section className="clip-section">
                            <h3>Aug 3 - Stream Title</h3>

                            <div className="clip-thumbnails swiper">
                                <Swiper
                                  modules={[Navigation]}
                                  spaceBetween={20}
                                  slidesPerView={5}
                                  breakpoints={swiperBreakpoints}
                                  navigation={{
                                    nextEl: '.swiper-button-next-1',
                                    prevEl: '.swiper-button-prev-1',
                                  }}
                                  onSlideChange={handleSlideChange1}
                                  onBreakpoint={handleBreakpoint1}
                                  className="swiper-wrapper"
                                >
                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>
                                </Swiper>
                                
                                {/* Custom pagination showing current/total */}
                                <div className="swiper-pagination-custom">
                                  {currentSlide1} / {getTotalPages(totalSlides, currentSlidesPerView1)}
                                </div>
                                <div className="swiper-button-prev-1">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                                <div className="swiper-button-next-1">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                            </div>

                        </section>

                        {/* <!-- Aug 2 Stream --> */}
                        <section className="clip-section">
                            <h3>Aug 2 - Stream Title</h3>

                            <div className="clip-thumbnails swiper">
                              <Swiper
                                modules={[Navigation]}
                                spaceBetween={20}
                                slidesPerView={5}
                                breakpoints={swiperBreakpoints}
                                navigation={{
                                  nextEl: '.swiper-button-next-2',
                                  prevEl: '.swiper-button-prev-2',
                                }}
                                onSlideChange={handleSlideChange2}
                                onBreakpoint={handleBreakpoint2}
                                className="swiper-wrapper"
                              >
                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                      <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                        <button className="clip-reject">
                                            <a href="#">Dislike</a>
                                        </button>
                                    </div>
                                  </div>
                                </SwiperSlide>
                              </Swiper>
                              
                              {/* Custom pagination showing current/total */}
                              <div className="swiper-pagination-custom">
                                {currentSlide2} / {getTotalPages(totalSlides, currentSlidesPerView2)}
                              </div>
                              <div className="swiper-button-prev-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div className="swiper-button-next-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </div>

                        </section>
                    </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  
  )
}