'use client'

import { useEffect, useState, useRef } from 'react'
import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { socket } from '@/lib/socket'

const MEDIA_SERVER_BASE_URL = 'http://localhost:5000/api'

interface LogType {
  level: string
  msg: string
  timestamp: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [isStreaming, setIsStreaming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streamUrl, setStreamUrl] = useState('')
  const [logs, setLogs] = useState<LogType[]>([])
  const logEndRef = useRef<HTMLDivElement | null>(null)
  const [clipLoading, setClipLoading] = useState(false)
  const [clipResult, setClipResult] = useState<string | null>(null)
  const [clipDuration, setClipDuration] = useState(30)
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null)

  useEffect(() => {
  const handleClipDone = (data: { url: string; duration: number; source?: string }) => {
        console.log('[clip_done received]', data); // ✅ this log will now appear
        if (data.url) {
          setClipResult(data.url);

          if (data.source === 'vod') {
            setFallbackMessage(`✅ VOD intro clip saved: ${data.url}`);
          } else if (data.source === 'manual') {
            setFallbackMessage(null);
          }
        }
      };

      const handleLog = (log: LogType) => {
        setLogs((prevLogs) => [...prevLogs, log]);
      };

      // log when socket first connects
      socket.on('connect', () => {
        console.log('[SOCKET CONNECTED]', socket.id);
      });

      // these handlers will now persist
      socket.on('clip_done', handleClipDone);
      socket.on('log', handleLog);

      return () => {
        socket.off('clip_done', handleClipDone);
        socket.off('log', handleLog);
        socket.off('connect');
      };
  }, []);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  async function startStream() {
  if (!streamUrl.trim()) {
    setError('Please enter a valid Twitch URL');
    return;
  }

  setLoading(true);
  setError(null);
  setFallbackMessage(null);
  setClipResult(null);

  try {
    const res = await fetch(`${MEDIA_SERVER_BASE_URL}/start-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: streamUrl }),
    });

    const data = await res.json();

    if (!res.ok && !data.fallback) {
      setError(data.error || data.message || 'Failed to start stream');
    } else {
      setIsStreaming(true);

      if (data.fallback && data.vod_url) {
        setFallbackMessage(`⚠️ Stream offline. Clipping from latest VOD: ${data.vod_url}`);
        setClipResult(null); 
        setIsStreaming(false); 
        setClipLoading(false);
      } else if (data.url || data.path) {
        setClipResult(data.url || data.path);
      }
    }
  } catch {
    setError('Network error while starting stream');
  }

  setLoading(false);
}



  async function stopStream() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${MEDIA_SERVER_BASE_URL}/stop-stream`, { method: 'POST' })
      if (!res.ok) {
        const errorData = await res.json()
        setError(errorData.message ?? 'Failed to stop stream')
      } else {
        setIsStreaming(false)
        setFallbackMessage(null)
      }
    } catch {
      setError('Network error while stopping stream')
    }
    setLoading(false)
  }

  async function triggerManualClip() {
    setClipLoading(true)
    setError(null)
    setClipResult(null)

    try {
      const res = await fetch(`${MEDIA_SERVER_BASE_URL}/manual-clip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: clipDuration }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Clip failed.')
      } else {
        setClipResult(data.url || data.path || 'Clip created.')
      }
    } catch {
      setError('Network error while clipping.')
    }

    setClipLoading(false)
  }


  async function extractFrames() {
    setLoading(true)
    try {
      const res = await fetch(`${MEDIA_SERVER_BASE_URL}/extract-frames`, { method: 'GET' })
      console.log(res);
    } catch {
      setError('Network error while stopping stream')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    clearAuthToken()
    router.push('/auth/login')
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Stream Test Tool</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Sign Out
        </button>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg space-y-4">
        <div>
          <label htmlFor="streamUrl" className="block mb-1 font-semibold">
            Twitch Stream URL
          </label>
          <input
            id="streamUrl"
            type="text"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            placeholder="https://www.twitch.tv/your_channel"
            className="w-full px-3 py-2 border rounded-md"
            disabled={loading || isStreaming}
          />
        </div>

        {error && <p className="text-red-600">Error: {error}</p>}

        <div className="flex gap-4">
          <button
            onClick={startStream}
            disabled={loading || isStreaming}
            className={`flex-1 px-4 py-2 rounded text-white ${
              isStreaming ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading && !isStreaming ? 'Starting...' : 'Start Stream'}
          </button>
          <button
            onClick={stopStream}
            disabled={loading || !isStreaming}
            className={`flex-1 px-4 py-2 rounded text-white ${
              !isStreaming ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading && isStreaming ? 'Stopping...' : 'Stop Stream'}
          </button>
        </div>
        <button
          onClick={extractFrames}
          disabled={loading}
          className={`flex-1 px-4 py-2 rounded text-white ${isStreaming ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {loading ? 'Extracting...' : 'Extract Frames'}
        </button>

        <div>
          <strong>Status: </strong>
          {fallbackMessage && (
            <span className="text-yellow-600 font-semibold break-all">
              {fallbackMessage}
            </span>
          )}
        </div>
        {clipResult && (
            <p className="mt-2 text-green-600 text-sm break-all">
              ✅ Clip saved:
              <br />
              <a
                href={clipResult}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {clipResult}
              </a>
            </p>
          )}

        <div className="mt-4 space-y-2">
          <label htmlFor="clipDuration" className="block font-semibold">
            Clip Duration (seconds)
          </label>
          <input
            id="clipDuration"
            type="number"
            min={10}
            max={300}
            value={clipDuration}
            onChange={(e) => setClipDuration(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
            disabled={clipLoading || !isStreaming}
          />

          <button
            onClick={triggerManualClip}
            disabled={clipLoading || !isStreaming}
            className={`w-full px-4 py-2 rounded text-white ${
              !isStreaming ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {clipLoading ? 'Clipping...' : `Manual Clip (${clipDuration}s)`}
          </button>


          
        </div>
      </div>

      <br />

      <div
        className="scrollbar-thin"
        style={{
          background: '#111',
          color: '#eee',
          fontFamily: 'monospace',
          height: '300px',
          overflowY: 'auto',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        {logs.map((log, idx) => (
          <div key={idx} style={{ marginBottom: 4 }}>
            <span style={{ color: getColor(log.level), fontWeight: 'bold' }}>
              [{log.level.toUpperCase()}]
            </span>{' '}
            <span>{new Date(log.timestamp).toLocaleTimeString()}</span>{' '}
            <span>{typeof log.msg === 'string' ? log.msg : JSON.stringify(log.msg)}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  )
}

function getColor(level: string): string {
  switch (level) {
    case 'error':
      return '#ff6161'
    case 'warn':
      return '#ffd700'
    case 'info':
      return '#4bc070'
    case 'debug':
      return '#00bcd4'
    default:
      return '#eee'
  }
}
