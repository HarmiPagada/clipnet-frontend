"use client"

import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { LogOut, Play, CheckCircle, Clock } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? ""
console.log("API_BASE from env:", API_BASE)

// Tiny helper to POST JSON and surface backend errors nicely
async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

// --- GET helper (simple) ---
async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

type PipelineStep = "idle" | "running" | "success" | "error"
type UserTier = "Free" | "Starter" | "Creator" | "Pro" | "Elite"

export function VodTestPanel() {
  const [vodUrl, setVodUrl] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [userTier, setUserTier] = useState<UserTier>("Free")

  type VodClip = {
  clip_id: string;
  segment_id: string;
  start_ms: number | null;
  end_ms: number | null;
  final_score: number | null;
  silence_preview_url?: string | null;
  media_status?: string | null;
  label: string; // built by the API
};

  const [clips, setClips] = useState<VodClip[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>("");

  // Track the resolved VOD id across steps
  const [vodId, setVodId] = useState("");

  // Segment index used by silence-trim/polish/upload (e.g. "0001")
  const [segmentIndex, setSegmentIndex] = useState("0001")

  // Where the polish endpoint tells us it wrote the file
  const [polishedPath, setPolishedPath] = useState("")



  const [clipsLoading, setClipsLoading] = useState(false);

  // Fallback if needed: parse Twitch ID from a videos URL
  const twitchIdFromUrl = (u: string) => {
    try {
      const m = u.match(/videos\/(\d+)/);
      return m?.[1] ?? "";
    } catch { return ""; }
  };

  useEffect(() => {
  setVodId(""); // force re-resolution after a new URL is typed
  setPolishedPath("");
  setClips([]); // clear loaded clips when URL changes
  }, [vodUrl]);

  const [pipelineSteps, setPipelineSteps] = useState<{
    ffmpeg: PipelineStep;
    transcribe: PipelineStep;
    ingest: PipelineStep;
    extractFrames: PipelineStep;
    scoring: PipelineStep;
    writeResults: PipelineStep;   // 2.106
    secondFilter: PipelineStep;   // 2.109
    pushGoodSegments: PipelineStep; // 2.2
    polish: PipelineStep;         // 2.3
    upload: PipelineStep;         // 2.108
  }>({
    ffmpeg: "idle",
    transcribe: "idle",
    ingest: "idle",
    extractFrames: "idle",
    scoring: "idle",
    writeResults: "idle",
    secondFilter: "idle",
    pushGoodSegments: "idle",
    polish: "idle",
    upload: "idle",
  });

  const [outputs, setOutputs] = useState<{
    ffmpeg: string;
    transcribe: string;
    ingest: string;
    extractFrames: string;
    scoring: string;
    writeResults: string;        // 2.106
    secondFilter: string;        // 2.109
    pushGoodSegments: string;    // 2.2
    polish: string;              // 2.3
    upload: string;              // 2.108
  }>({
    ffmpeg: "",
    transcribe: "",
    ingest: "",
    extractFrames: "",
    scoring: "",
    writeResults: "",
    secondFilter: "",
    pushGoodSegments: "",
    polish: "",
    upload: "",
  });

  const handleValidateVod = () => {
    if (!vodUrl) {
      toast.error("Please enter a VOD URL")
      return
    }
    toast.success("VOD validation completed (stub)")
  }

  const runPipelineStep = async (step: keyof typeof pipelineSteps) => {
    setPipelineSteps(prev => ({ ...prev, [step]: "running" }))
    await new Promise(resolve => setTimeout(resolve, 2000))
    setPipelineSteps(prev => ({ ...prev, [step]: "success" }))
    setOutputs(prev => ({
      ...prev,
      [step]: `${step.charAt(0).toUpperCase() + step.slice(1)} completed (stub)`
    }))
    toast.success(`${step.charAt(0).toUpperCase() + step.slice(1)} step completed`)
  }

  const getStatusIcon = (status: PipelineStep) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4 animate-spin" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: PipelineStep) => {
    const variants = {
      idle: "secondary" as const,
      running: "default" as const,
      success: "default" as const,
      error: "destructive" as const
    }
    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  // Helpers for segment naming (consistent with your docs)
  const segPadded = () => segmentIndex.padStart(4, "0")
  // Task 2.112/2.3 use segment_metadata.segment_id form: <vodId>_segment_<####>
  const segmentId_2_112 = () => {
    const id = vodId || twitchIdFromUrl(vodUrl)
    return id ? `${id}_segment_${segPadded()}` : ""
  }
  // Clips/Cloudinary often use clip_id form: segment_<####>_<vodId>
  const clipId = () => {
    const id = vodId || twitchIdFromUrl(vodUrl)
    return id ? `segment_${segPadded()}_${id}` : ""
  }
  // Default polished filename if server doesn't return a full file_path
  const defaultPolishedFilename = () => `polished_segment_${segPadded()}_${vodId || twitchIdFromUrl(vodUrl)}.mp4`

  // Step #1 — Whisper transcription
  const runTranscribe = async () => {
    const id = vodId || twitchIdFromUrl(vodUrl);
    if (!id) {
      toast.error("No vod_id available. Run FFmpeg first or enter a Twitch VOD url.");
      setPipelineSteps(p => ({ ...p, transcribe: "error" }));
      setOutputs(o => ({ ...o, transcribe: 'Missing vod_id' }));
      return;
    }
    try {
      setPipelineSteps(p => ({ ...p, transcribe: "running" }));
      const data = await postJson<{ success?: boolean; message?: string; transcriptPath?: string }>(
        `${API_BASE}/api/transcribe-vod`,
        { vod_id: id }
      );
      const lines = [
        data.message && `Message: ${data.message}`,
        data.transcriptPath && `Transcript: ${data.transcriptPath}`,
        data.success !== undefined && `Success: ${data.success}`,
      ].filter(Boolean) as string[];
      setOutputs(o => ({
        ...o,
        transcribe: lines.length ? lines.join("\n") : "Transcription started/completed.",
      }));
      setPipelineSteps(p => ({ ...p, transcribe: "success" }));
      toast.success("Transcription step completed");
    } catch (err: any) {
      const msg = err?.message || "Transcription failed";
      setOutputs(o => ({ ...o, transcribe: msg }));
      setPipelineSteps(p => ({ ...p, transcribe: "error" }));
      toast.error(msg);
    }
  };

  // Step #2 —  (FFmpeg VOD clipper)
  const runVodClipper = async () => {
    if (!vodUrl) {
      toast.error("Please enter a VOD URL");
      return;
    }
    try {
      setPipelineSteps(p => ({ ...p, ffmpeg: "running" }));
      const payload = { vod_url: vodUrl, segment_duration: 30, overlap: 10 };
      const data = await postJson<{
        success?: boolean;
        vodId?: string;
        outputDir?: string;
        segments?: number;
        manifest?: string;
        error?: string;
      }>(`${API_BASE}/api/vod-clipper`, payload);
      setVodId(data.vodId ?? twitchIdFromUrl(vodUrl));
      const lines = [
        data.success !== undefined && `Success: ${data.success}`,
        data.vodId && `VOD ID: ${data.vodId}`,
        data.segments !== undefined && `Segments: ${data.segments}`,
        data.outputDir && `Output Dir: ${data.outputDir}`,
        data.manifest && `Manifest: ${data.manifest}`,
        data.error && `Error: ${data.error}`,
      ].filter(Boolean) as string[];
      setOutputs(o => ({ ...o, ffmpeg: lines.length ? lines.join("\n") : "FFmpeg started/completed." }));
      setPipelineSteps(p => ({ ...p, ffmpeg: "success" }));
      toast.success("FFmpeg on VOD completed");
    } catch (err: any) {
      const msg = err?.message || "Ingest failed";
      setOutputs(o => ({ ...o, ffmpeg: msg }));
      setPipelineSteps(p => ({ ...p, ffmpeg: "error" }));
      toast.error(msg);
    }
  };


  // run frames on provided vod url
  const runExtractFrames = async () => {
    const id = vodId || twitchIdFromUrl(vodUrl);
    if (!id && !vodUrl) {
      toast.error("Enter a VOD URL first.");
      setPipelineSteps(p => ({ ...p, extractFrames: "error" }));
      setOutputs(o => ({ ...o, extractFrames: "Missing vod_id / vod_url" }));
      return;
    }
    try {
      setPipelineSteps(p => ({ ...p, extractFrames: "running" }));
      const payload: any = { segment_duration: 30, overlap: 10, fps: 2 };
      if (id) payload.vod_id = id; else payload.vod_url = vodUrl;
      const data = await postJson<{
        success?: boolean;
        vodId?: string;
        framesDir?: string;
        csvPath?: string;
        topFramesJson?: string;
        error?: string;
      }>(`${API_BASE}/api/extract-frames-from-vod`, payload);
      if (data.vodId) setVodId(data.vodId);
      const lines = [
        data.success !== undefined && `Success: ${data.success}`,
        data.vodId && `VOD ID: ${data.vodId}`,
        data.framesDir && `Frames Dir: ${data.framesDir}`,
        data.csvPath && `Scores CSV: ${data.csvPath}`,
        data.topFramesJson && `Top Frames JSON: ${data.topFramesJson}`,
        data.error && `Error: ${data.error}`,
      ].filter(Boolean) as string[];
      setOutputs(o => ({ ...o, extractFrames: lines.length ? lines.join("\n") : "Frame extraction started/completed." }));
      setPipelineSteps(p => ({ ...p, extractFrames: "success" }));
      toast.success("Frame extraction completed");
    } catch (err: any) {
      const msg = err?.message || "Frame extraction failed";
      setOutputs(o => ({ ...o, extractFrames: msg }));
      setPipelineSteps(p => ({ ...p, extractFrames: "error" }));
      toast.error(msg);
    }
  };

  // run fake scorer for vod url

  const runScoring = async () => {
  const id = vodId || twitchIdFromUrl(vodUrl);
  if (!id) {
    toast.error("Missing vod_id for Scoring");
    setPipelineSteps(p => ({ ...p, scoring: "error" }));
    setOutputs(o => ({ ...o, scoring: "Missing vod_id" }));
    return;
  }
  try {
    setPipelineSteps(p => ({ ...p, scoring: "running" }));
    const data = await postJson<{
      success?: boolean;
      vodId?: string;
      segmentsFound?: number;
      ingested?: number;
      error?: string;
    }>(`${API_BASE}/api/internal/score-vod`, {
      vod_id: id,
      // optionally pass these if you want them persisted:
      // streamer_name: "some_name",
      // stream_id: `stream_${id}`,
      // category: "Just Chatting",
    });

    const lines = [
      data.success !== undefined && `Success: ${data.success}`,
      data.vodId && `VOD ID: ${data.vodId}`,
      data.segmentsFound !== undefined && `Segments Found: ${data.segmentsFound}`,
      data.ingested !== undefined && `Rows Ingested: ${data.ingested}`,
      data.error && `Error: ${data.error}`,
    ].filter(Boolean) as string[];

    setOutputs(o => ({ ...o, scoring: lines.join("\n") || "Scoring done." }));
    setPipelineSteps(p => ({ ...p, scoring: "success" }));
    toast.success("Scoring (stub) completed & ingested");
  } catch (err: any) {
    const msg = err?.message || "Scoring failed";
    setOutputs(o => ({ ...o, scoring: msg }));
    setPipelineSteps(p => ({ ...p, scoring: "error" }));
    toast.error(msg);
  }
  };

  // Load 2.2-approved clips for the current VOD
  const loadClips = async (id: string) => {
  if (!id) {
    toast.error("Run FFmpeg or enter a valid VOD URL first.");
    return;
  }
  try {
    setClipsLoading(true);

    // cache-bust + disable cache so we don't get a 304 from the ETag
    const res = await fetch(
      `${API_BASE}/api/vods/${encodeURIComponent(id)}/clips?ts=${Date.now()}`,
      { method: "GET", cache: "no-store", headers: { "Cache-Control": "no-cache" } }
    );

    // treat 304 as "no changes" instead of throwing
    if (res.status === 304) {
      toast.message("Clips unchanged");
      return;
    }
    if (!res.ok) throw new Error(`Failed to load clips: ${res.status}`);

    const data: VodClip[] = await res.json();
    setClips(data);

    // ✅ preserve current selection if it's still there; otherwise fall back to first
    setSelectedSegmentId(prev =>
      prev && data.some(c => c.segment_id === prev)
        ? prev
        : (data[0]?.segment_id ?? "")
    );

    toast.success(`Loaded ${data.length} approved clip(s)`);
  } catch (err: any) {
    toast.error(err?.message || "Failed to load 2.2 clips");
  } finally {
    setClipsLoading(false);
  }
  };

    // Human-readable status for a clip row


  // --- Task 2.106: Write results
  const runWriteResults = async () => {
    const id = vodId || twitchIdFromUrl(vodUrl);
    if (!id) {
      toast.error("Missing vod_id for Write Results");
      setPipelineSteps(p => ({ ...p, writeResults: "error" }));
      setOutputs(o => ({ ...o, writeResults: "Missing vod_id" }));
      return;
    }
    try {
      setPipelineSteps(p => ({ ...p, writeResults: "running" }));
      const data = await postJson<{ success?: boolean; vodId?: string; rowId?: string; error?: string }>(
        `${API_BASE}/api/write-vod-results`, { vod_id: id }
      );
      const lines = [
        data.success !== undefined && `Success: ${data.success}`,
        data.vodId && `VOD ID: ${data.vodId}`,
        data.rowId && `DB Row ID: ${data.rowId}`,
        data.error && `Error: ${data.error}`,
      ].filter(Boolean) as string[];
      setOutputs(o => ({ ...o, writeResults: lines.join("\n") || "Wrote results." }));
      setPipelineSteps(p => ({ ...p, writeResults: "success" }));
      toast.success("Results written to DB");
    } catch (err: any) {
      const msg = err?.message || "Write results failed";
      setOutputs(o => ({ ...o, writeResults: msg }));
      setPipelineSteps(p => ({ ...p, writeResults: "error" }));
      toast.error(msg);
    }
  };

  // --- Task 2.2: Push good segments
  const runPushGoodSegments = async () => {
  const id = vodId || twitchIdFromUrl(vodUrl);
  if (!id) {
    toast.error("Missing vod_id for Push Good Segments");
    setPipelineSteps(p => ({ ...p, pushGoodSegments: "error" }));
    setOutputs(o => ({ ...o, pushGoodSegments: "Missing vod_id" }));
    return;
  }
  try {
    setPipelineSteps(p => ({ ...p, pushGoodSegments: "running" }));

    const data = await postJson<{
      selected: number;
      clips: Array<any>;
    }>(`${API_BASE}/api/clips/generate`, {
      stream_id: id.startsWith("stream_") ? id : `stream_${id}`,    // <- IMPORTANT: backend expects stream_id
      // from: 0, to: 2147483647,     // optional window
    });

    setOutputs(o => ({ ...o, pushGoodSegments: `Selected: ${data.selected}` }));
    setPipelineSteps(p => ({ ...p, pushGoodSegments: "success" }));
    toast.success(`Good segments pushed: ${data.selected}`);
    } catch (err: any) {
        const msg = err?.message || "Push good segments failed";
        setOutputs(o => ({ ...o, pushGoodSegments: msg }));
        setPipelineSteps(p => ({ ...p, pushGoodSegments: "error" }));
        toast.error(msg);
    }
    };

  // --- Task 2.109: Second filter
  const runSecondFilterShadow = async () => {
  const id = vodId || twitchIdFromUrl(vodUrl);
  if (!id) {
    toast.error("Missing vod_id for Second Filter");
    setPipelineSteps(p => ({ ...p, secondFilter: "error" }));
    setOutputs(o => ({ ...o, secondFilter: "Missing vod_id" }));
    return;
  }
  try {
    setPipelineSteps(p => ({ ...p, secondFilter: "running" }));

    // IMPORTANT: backend must accept { vod_id } and fan-out over segment_metadata
    const data = await postJson<{ count: number; results: Array<{ filter_decision: string }> }>(
      `${API_BASE}/api/internal/segments/score`,
      { vod_id: id }
    );

    // Client-side summary
    const kept = data.results.filter(r => r.filter_decision === "accept").length;
    const flagged = data.results.filter(r => r.filter_decision === "flag_review").length;
    const rejected = data.results.filter(r => r.filter_decision === "reject").length;

    const lines = [
      `VOD ID: ${id}`,
      `Shadow Mode: ${process.env.NEXT_PUBLIC_SCORING_SHADOW ?? "server-controlled"}`,
      `Scored: ${data.count}`,
      `Accept: ${kept}`,
      `Flag review: ${flagged}`,
      `Reject: ${rejected}`,
    ];

    setOutputs(o => ({ ...o, secondFilter: lines.join("\n") }));
    setPipelineSteps(p => ({ ...p, secondFilter: "success" }));
    toast.success("Second filter executed");
  } catch (err: any) {
    const msg = err?.message || "Second filter failed";
    setOutputs(o => ({ ...o, secondFilter: msg }));
    setPipelineSteps(p => ({ ...p, secondFilter: "error" }));
    toast.error(msg);
  }
  };

  // --- Task 2.3: Polish clip (uses EDL; server may lazy-build EDL if absent)
  // --- Task 2.3 (+ 2.112): One-click silence + polish

  const runSilencePolishClip = async (force = false) => {
    const segId = selectedSegmentId;
    if (!segId) {
      toast.error("Missing segment_id (pick a 2.2-approved clip first)");
      setPipelineSteps((p) => ({ ...p, polish: "error" }));
      setOutputs((o) => ({ ...o, polish: "Missing segment_id" }));
      return;
    }
    try {
      setPipelineSteps((p) => ({ ...p, polish: "running" }));
      const data = await postJson<{
        status?: string;
        segment_id?: string;
        output?: string;
        used_overlay?: boolean;
        ensured_edl?: boolean;
        error?: string;
      }>(`${API_BASE}/api/segments/${encodeURIComponent(segId)}/polish-with-silence`, { force });

      const lines = [
        data.status && `Status: ${data.status}`,
        data.segment_id && `Segment ID: ${data.segment_id}`,
        data.ensured_edl !== undefined && `Ensured EDL: ${String(data.ensured_edl)}`,
        data.output && `Output: ${data.output}`,
        data.used_overlay !== undefined && `Used Overlay: ${data.used_overlay}`,
        data.error && `Error: ${data.error}`,
      ].filter(Boolean) as string[];

      const outPath = data.output || defaultPolishedFilename();
      setPolishedPath(outPath);

      // Reflect polished status in local list
      setClips((prev) =>
        prev.map((c) => (c.segment_id === segId ? { ...c, silence_preview_url: outPath } : c))
      );

      setOutputs((o) => ({ ...o, polish: lines.join("\n") || "Silence + Polish completed." }));
      setPipelineSteps((p) => ({ ...p, polish: "success" }));
      toast.success("Silence + Polish completed");

      // Refresh to pick up media_status/joins
      const id = vodId || twitchIdFromUrl(vodUrl);
      if (id) {
        await loadClips(id);
      }
    } catch (err: any) {
      const msg = err?.message || "Silence + Polish failed";
      setOutputs((o) => ({ ...o, polish: msg }));
      setPipelineSteps((p) => ({ ...p, polish: "error" }));
      toast.error(msg);
    }
  };

  // --- Task 2.108: Upload polished clip to Cloudinary
  const runUploadToCloudinary = async () => {
    const id = vodId || twitchIdFromUrl(vodUrl); // "2279464375"
    const seg = segPadded();                      // "0003"
  
    if (!polishedPath) {
    toast.error("No polished clip found. Pick a polished clip or run 'Polish Clip' first.");
    setPipelineSteps(p => ({ ...p, upload: "error" }));
    setOutputs(o => ({ ...o, upload: "Missing polishedPath" }));
    return;
    }
    if (!id) {
      toast.error("Missing vod_id for Upload");
      setPipelineSteps(p => ({ ...p, upload: "error" }));
      setOutputs(o => ({ ...o, upload: "Missing vod_id" }));
      return;
    }
    try {
      setPipelineSteps(p => ({ ...p, upload: "running" }));

      // Prefer explicit file_path from polish response; fallback to resolver style
      const normalizedPath = polishedPath.replace(/^file:\/\//, ""); // <-- new
      const body =
      normalizedPath
        ? { clip_id: `segment_${seg}_${id}`, user_id: "1", file_path: normalizedPath }
        : { clip_id: `segment_${seg}_${id}`, user_id: "1", vod_id: id, segment_file: `polished_segment_${seg}_${id}.mp4` };

      const data = await postJson<{
        cloudinary_public_id?: string;
        cloudinary_url?: string;
        media_expires_at?: string;
        error?: string;
      }>(`${API_BASE}/api/media/upload`, body);

      const lines = [
        data.cloudinary_public_id && `Public ID: ${data.cloudinary_public_id}`,
        data.cloudinary_url && `URL: ${data.cloudinary_url}`,
        data.media_expires_at && `Expires: ${data.media_expires_at}`,
        data.error && `Error: ${data.error}`,
      ].filter(Boolean) as string[];

      setOutputs(o => ({ ...o, upload: lines.join("\n") || "Uploaded." }));
      setPipelineSteps(p => ({ ...p, upload: "success" }));
      toast.success("Uploaded to Cloudinary");
    } catch (err: any) {
      const msg = err?.message || "Upload failed";
      setOutputs(o => ({ ...o, upload: msg }));
      setPipelineSteps(p => ({ ...p, upload: "error" }));
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">VOD Pipeline Tester</h1>
        <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="space-y-6">
          {/* VOD URL */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">VOD URL</label>
            <Input
              placeholder="https://twitch.tv/videos/..."
              value={vodUrl}
              onChange={(e) => setVodUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Start Time (hh:mm:ss)</label>
              <Input
                placeholder="00:00:00"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">End Time (hh:mm:ss)</label>
              <Input
                placeholder="00:05:00"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          {/* User Tier + Segment Index */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">User Tier</label>
              <Select value={userTier} onValueChange={(value: UserTier) => setUserTier(value)}>
                <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Creator">Creator</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Elite">Elite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Segment Index (e.g., 0001)
              </label>
              <Input
                placeholder="0001"
                value={segmentIndex}
                onChange={(e) => setSegmentIndex(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          {/* 0. FFmpeg on VOD */}
          <section className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">0. FFmpeg on VOD</h4>
              {getStatusBadge(pipelineSteps.ffmpeg)}
            </div>
            <div className="space-y-3">
              {pipelineSteps.ffmpeg === "running" ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <div className="bg-gray-50 p-3 rounded text-sm min-h-[5rem] border border-gray-200 whitespace-pre-wrap">
                  {outputs.ffmpeg || "Output placeholder..."}
                </div>
              )}
              <Button
                onClick={runVodClipper}
                disabled={pipelineSteps.ffmpeg === "running"}
                className={`w-full py-3 rounded-lg font-medium ${pipelineSteps.ffmpeg === "running"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"}`}
              >
                Run FFmpeg on VOD
              </Button>
            </div>
          </section>

          {/* Pipeline Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pipeline Steps</h3>

            {/* 1. Transcription (Whisper) */}
            <section className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">1. Transcription (Whisper)</h4>
                {getStatusBadge(pipelineSteps.transcribe)}
              </div>
              <div className="space-y-3">
                {pipelineSteps.transcribe === "running" ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <div className="bg-gray-50 p-3 rounded text-sm min-h-[5rem] border border-gray-200 whitespace-pre-wrap">
                    {outputs.transcribe || "Output placeholder..."}
                  </div>
                )}
                <Button
                  onClick={runTranscribe}
                  disabled={pipelineSteps.transcribe === "running" || !(vodId || twitchIdFromUrl(vodUrl))}
                  className={`w-full py-3 rounded-lg font-medium ${pipelineSteps.transcribe === "running"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  Run Whisper Transcription
                </Button>
              </div>
            </section>

            {/* 2. Extract Frames */}
            <section className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">2. Extract Frames</h4>
                {getStatusBadge(pipelineSteps.extractFrames)}
              </div>
              <div className="space-y-3">
                {pipelineSteps.extractFrames === "running" ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <div className="bg-gray-50 p-3 rounded text-sm min-h-[5rem] border border-gray-200">
                    {outputs.extractFrames || "Output placeholder..."}
                  </div>
                )}
                <Button
                  onClick={runExtractFrames}
                  disabled={pipelineSteps.extractFrames === "running" || (!vodId && !twitchIdFromUrl(vodUrl))}
                  className={`w-full py-3 rounded-lg font-medium ${pipelineSteps.extractFrames === "running"
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Run Frame Extraction
                </Button>
              </div>
            </section>

            {/* 3. Scoring */}
            <section className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">3. Scoring</h4>
                {getStatusBadge(pipelineSteps.scoring)}
              </div>
              <div className="space-y-3">
                {pipelineSteps.scoring === "running" ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <div className="bg-gray-50 p-3 rounded text-sm min-h-[5rem] border border-gray-200">
                    {outputs.scoring || "Output placeholder..."}
                  </div>
                )}
                <Button
                onClick={runScoring}
                disabled={
                    pipelineSteps.scoring === "running" ||
                    !(vodId || twitchIdFromUrl(vodUrl)) ||
                    pipelineSteps.extractFrames !== "success"
                }
                className={`w-full py-3 rounded-lg font-medium ${
                    pipelineSteps.scoring === "running"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                >
                <Play className="h-4 w-4 mr-2" />
                Run Scoring
                </Button>
              </div>
            </section>


            {/* 5. Second Filter (2.109) */}
            <section className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">5. Adaptive Scoring Filter (2.109)</h4>
                {getStatusBadge(pipelineSteps.secondFilter)}
            </div>
            <div className="space-y-3">
                {pipelineSteps.secondFilter === "running" ? (
                <Skeleton className="h-20 w-full" />
                ) : (
                <div className="bg-gray-50 p-3 rounded text-sm min-h-[5rem] border border-gray-200 whitespace-pre-wrap">
                    {outputs.secondFilter || "Output placeholder..."}
                </div>
                )}
                <Button
                onClick={runSecondFilterShadow}
                disabled={pipelineSteps.secondFilter === "running" || !(vodId || twitchIdFromUrl(vodUrl))}
                className={`w-full py-3 rounded-lg font-medium ${pipelineSteps.secondFilter === "running"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                <Play className="h-4 w-4 mr-2" />
                Run Category-Adaptive Filtering (Shadow-aware)
                </Button>
            </div>
            </section>

            {/* 6. Push Good Segments (2.2) */}
            <section className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">6. Push Good Segments (2.2)</h4>
                {getStatusBadge(pipelineSteps.pushGoodSegments)}
              </div>
              <div className="space-y-3">
                {pipelineSteps.pushGoodSegments === "running" ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <div className="bg-gray-50 p-3 rounded text-sm min-h-[5rem] border border-gray-200 whitespace-pre-wrap">
                    {outputs.pushGoodSegments || "Output placeholder..."}
                  </div>
                )}
                <Button
                  onClick={runPushGoodSegments}
                  disabled={pipelineSteps.pushGoodSegments === "running" || !(vodId || twitchIdFromUrl(vodUrl))}
                  className={`w-full py-3 rounded-lg font-medium ${pipelineSteps.pushGoodSegments === "running"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Push Good Segments to Clips
                </Button>
              </div>
            </section>

            {/* 7. Polish Clip (2.3) */}
            <section className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">7. Polish Clip (2.3)</h4>
                {getStatusBadge(pipelineSteps.polish)}
              </div>
              <div className="space-y-3">
                {/* NEW: Select segment (2.2-approved) */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-700">
                        Select segment (2.2 approved) — sets Segment Index
                    </label>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => loadClips(vodId || twitchIdFromUrl(vodUrl))}
                        disabled={clipsLoading || !(vodId || twitchIdFromUrl(vodUrl))}
                    >
                        {clipsLoading ? "Loading..." : "Load 2.2 Clips"}
                    </Button>
                    </div>
                    <select
                      value={selectedSegmentId}
                          onChange={(e) => {
                          const sid = e.target.value;
                          setSelectedSegmentId(sid);
                          setPolishedPath(""); // avoid cross-segment confusion

                          // NEW: keep segmentIndex in sync (expects "..._segment_0001" shape)
                          const idx = sid.split("_").pop() || "";
                          if (idx) setSegmentIndex(idx);
                        }}
                      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
                      >
                      <option value="" disabled>
                        {clips.length ? "Select a segment…" : "Load 2.2 clips first"}
                      </option>
                      {clips.map((c) => (
                        <option key={c.segment_id} value={c.segment_id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                </div>

                {/* Existing output box */}
                {pipelineSteps.polish === "running" ? (
                    <Skeleton className="h-20 w-full" />
                ) : (
                    <div className="bg-gray-50 p-3 rounded text-sm min-h-[5rem] border border-gray-200 whitespace-pre-wrap">
                    {outputs.polish || "Output placeholder..."}
                    </div>
                )}

                {/* target segment to polish */}
                <div className="text-[11px] text-gray-600">
                  Target segment_id: <span className="font-mono break-all">
                    {selectedSegmentId || "—"}
                  </span>
                </div>

                <Button
                  onClick={() => runSilencePolishClip(true)}
                  disabled={pipelineSteps.polish === "running" || !selectedSegmentId}
                  className={`w-full py-3 rounded-lg font-medium ${
                    pipelineSteps.polish === "running" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Silence + Polish Clip
                </Button>
                </div>
            </section>

            {/* 8. Upload to Cloudinary (2.108) */}
            <section className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">8. Upload to Cloudinary (2.108)</h4>
                {getStatusBadge(pipelineSteps.upload)}
              </div>
              <div className="space-y-3">
                {/* NEW: Select polished clip (has silence_preview_url) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-700">
                      Select polished clip — sets Segment & polishedPath
                    </label>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => loadClips(vodId || twitchIdFromUrl(vodUrl))}
                      disabled={clipsLoading || !(vodId || twitchIdFromUrl(vodUrl))}
                    >
                      {clipsLoading ? "Loading..." : "Refresh List"}
                    </Button>
                  </div>

                  {/* Simple select fed by `clips` (polished only) */}
                  <select
                      value={selectedSegmentId}
                      onChange={(e) => {
                        const sid = e.target.value;
                        setSelectedSegmentId(sid);

                        // keep segmentIndex in sync
                        const idx = sid.split("_").pop() || "";
                        if (idx) setSegmentIndex(idx);

                        // set polishedPath from the selected row
                        const row = clips.find((r) => r.segment_id === sid);
                        setPolishedPath(row?.silence_preview_url || "");
                      }}
                      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
                      >
                    <option value="" disabled>
                      {clips.some((c) => !!c.silence_preview_url)
                        ? "Select a polished clip…"
                        : "No polished clips yet — polish one in step 7"}
                    </option>
                    {clips
                      .filter((r) => !!r.silence_preview_url)
                      .map((r) => (
                        <option key={r.segment_id} value={r.segment_id}>
                          {r.label}
                        </option>
                      ))}
                  </select>

                  <div className="text-[11px] text-gray-600">
                    Current polishedPath: <span className="font-mono break-all">{polishedPath || "—"}</span>
                  </div>
                </div>

                {/* Existing output box */}
                {pipelineSteps.upload === "running" ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <div className="bg-gray-50 p-3 rounded text-sm min-h-[5rem] border border-gray-200 whitespace-pre-wrap">
                    {outputs.upload || "Output placeholder..."}
                  </div>
                )}

                <Button
                  onClick={runUploadToCloudinary}
                  disabled={pipelineSteps.upload === "running" || !(vodId || twitchIdFromUrl(vodUrl))}
                  className={`w-full py-3 rounded-lg font-medium ${
                    pipelineSteps.upload === "running" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Upload to Cloudinary
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Artifacts Preview */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Artifacts Preview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-600 border-2 border-dashed border-gray-300"
            >
              Frame {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Job History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job History</h3>
        <div className="space-y-3">
          {[
            { id: "1", vodUrl: "https://twitch.tv/videos/123456789", tier: "Pro", status: "completed" },
            { id: "2", vodUrl: "https://twitch.tv/videos/987654321", tier: "Creator", status: "failed" },
            { id: "3", vodUrl: "https://twitch.tv/videos/456789123", tier: "Starter", status: "running" }
          ].map((job) => (
            <div key={job.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="space-y-1">
                <p className="font-medium text-sm text-gray-900 truncate max-w-md">{job.vodUrl}</p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>{job.tier}</span>
                  <span>•</span>
                  <span>2024-12-01 14:30:00</span>
                </div>
              </div>
              <Badge
                variant={
                  job.status === "completed" ? "default" :
                  job.status === "failed" ? "destructive" : "secondary"
                }
              >
                {job.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
