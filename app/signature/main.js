"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import {
  applySignature,
  clearSignatureCanvas,
  initDrawCanvas,
  isValidImageFile,
  PLACEMENT_CONFIG,
  SIGNATURE_MODES,
  undoLastStroke,
} from "../lib/pdfSignature";

const MODE_TABS = [
  { id: SIGNATURE_MODES.DRAW, label: "Draw" },
  { id: SIGNATURE_MODES.TYPE, label: "Type" },
  { id: SIGNATURE_MODES.UPLOAD, label: "Upload" },
];

export default function SignatureMain() {
  const [pdfFile, setPdfFile] = useState(null);
  const [mode, setMode] = useState(SIGNATURE_MODES.DRAW);
  const [pageCount, setPageCount] = useState(1);
  const [pageNumber, setPageNumber] = useState(PLACEMENT_CONFIG.PAGE_NUMBER);
  const [position, setPosition] = useState(PLACEMENT_CONFIG.POSITION);
  const [widthPercent, setWidthPercent] = useState(PLACEMENT_CONFIG.WIDTH_PERCENT);
  const [opacity, setOpacity] = useState(PLACEMENT_CONFIG.OPACITY);
  const [customX, setCustomX] = useState("");
  const [customY, setCustomY] = useState("");
  const [typeText, setTypeText] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [stage, setStage] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);

  const canvasRef = useRef(null);
  const strokeHistoryRef = useRef([]);
  const drawControlsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    drawControlsRef.current = initDrawCanvas(canvas, strokeHistoryRef.current);
    return () => {
      drawControlsRef.current?.destroy?.();
      drawControlsRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const refreshPageCount = async () => {
      if (!pdfFile || pdfFile.type !== "application/pdf" || pdfFile.size === 0) {
        setPageCount(1);
        setPageNumber(1);
        return;
      }

      try {
        const bytes = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(bytes);
        const totalPages = Math.max(1, pdfDoc.getPageCount());

        if (!cancelled) {
          setPageCount(totalPages);
          setPageNumber((current) => Math.min(Math.max(1, current), totalPages));
        }

        await pdfDoc.destroy?.();
      } catch {
        if (!cancelled) {
          setPageCount(1);
          setPageNumber(1);
        }
      }
    };

    void refreshPageCount();

    return () => {
      cancelled = true;
    };
  }, [pdfFile]);

  const pageOptions = useMemo(
    () =>
      Array.from({ length: pageCount }, (_, index) => {
        const value = index + 1;
        return (
          <option key={value} value={value}>
            Page {value}
          </option>
        );
      }),
    [pageCount],
  );

  const handlePdfChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setPdfFile(file);
    setErrorMessage(null);
    setStatus("idle");
    setStage("idle");
  };

  const handleSign = async () => {
    if (!pdfFile) {
      toast.error("Please select a valid PDF.");
      return;
    }

    if (pdfFile.type !== "application/pdf") {
      toast.error("Please select a valid PDF.");
      return;
    }

    const payload =
      mode === SIGNATURE_MODES.DRAW
        ? canvasRef.current
        : mode === SIGNATURE_MODES.TYPE
          ? typeText
          : uploadFile;

    const customPlacement =
      position === "custom"
        ? {
            CUSTOM_X: customX === "" ? null : Number(customX),
            CUSTOM_Y: customY === "" ? null : Number(customY),
          }
        : {};

    setStatus("processing");
    setErrorMessage(null);
    setStage("starting");
    toast.loading("Applying signature...", { id: "signature" });

    try {
      await applySignature(
        pdfFile,
        mode,
        payload,
        {
          ...PLACEMENT_CONFIG,
          PAGE_NUMBER: pageNumber,
          POSITION: position,
          WIDTH_PERCENT: widthPercent,
          OPACITY: opacity,
          ...customPlacement,
        },
        (nextStage) => setStage(nextStage),
      );

      setStatus("done");
      toast.success("Download started.", { id: "signature" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not sign this PDF.";
      setStatus("error");
      setErrorMessage(message);
      toast.error(message, { id: "signature" });
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    clearSignatureCanvas(canvas);
    strokeHistoryRef.current.length = 0;
  };

  const undoStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    undoLastStroke(canvas, strokeHistoryRef.current);
  };

  const isProcessing = status === "processing";
  const hasPdf = pdfFile !== null;
  const selectedFileLabel = pdfFile ? pdfFile.name : "No file selected";

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M7 16l5-11 5 11M9.5 12h5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Sign PDF</h1>
          </div>
          <p className="text-muted">
            Draw, type, or upload a signature and place it directly onto a chosen page in your PDF. Everything stays in your browser.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-foreground">PDF file</span>
              <input
                id="pdf-input"
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="block w-full cursor-pointer rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </label>

            <div className="grid gap-2">
              <span className="text-sm font-semibold text-foreground">Signature mode</span>
              <div
                id="sig-mode-tabs"
                data-active-mode={mode}
                className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-background p-1"
              >
                {MODE_TABS.map((tab) => {
                  const active = mode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setMode(tab.id)}
                      aria-pressed={active}
                      className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                        active ? "bg-indigo-500 text-white shadow-sm" : "text-muted hover:bg-card hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-[1fr_180px]">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground">Page</span>
                <select
                  id="page-select"
                  value={pageNumber}
                  onChange={(event) => setPageNumber(parseInt(event.target.value, 10))}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground"
                >
                  {pageOptions}
                </select>
              </label>

              <div className="grid gap-2">
                <span className="text-sm font-semibold text-foreground">Selected file</span>
                <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted">
                  {selectedFileLabel}
                </div>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground">Position</span>
                <select
                  value={position}
                  onChange={(event) => setPosition(event.target.value)}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground"
                >
                  <option value="bottom-right">Bottom right</option>
                  <option value="bottom-left">Bottom left</option>
                  <option value="bottom-center">Bottom center</option>
                  <option value="custom">Custom</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground">Width %</span>
                <input
                  type="number"
                  min="0.1"
                  max="0.6"
                  step="0.01"
                  value={widthPercent}
                  onChange={(event) =>
                    setWidthPercent(
                      event.target.value === "" ? PLACEMENT_CONFIG.WIDTH_PERCENT : Number(event.target.value),
                    )
                  }
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground">Opacity</span>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(event) =>
                    setOpacity(event.target.value === "" ? PLACEMENT_CONFIG.OPACITY : Number(event.target.value))
                  }
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground"
                />
              </label>
            </div>

            {position === "custom" && (
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-foreground">Custom X</span>
                  <input
                    type="number"
                    value={customX}
                    onChange={(event) => setCustomX(event.target.value)}
                    placeholder="PDF points"
                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-foreground">Custom Y</span>
                  <input
                    type="number"
                    value={customY}
                    onChange={(event) => setCustomY(event.target.value)}
                    placeholder="PDF points"
                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted"
                  />
                </label>
              </div>
            )}

            <div className={mode === SIGNATURE_MODES.DRAW ? "grid gap-4" : "hidden"}>
              <div className="rounded-3xl border border-border bg-background p-4">
                <canvas
                  id="signature-canvas"
                  ref={canvasRef}
                  width={1200}
                  height={360}
                  className="h-[220px] w-full rounded-2xl border border-dashed border-border bg-white"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={undoStroke}
                    className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background"
                  >
                    Undo
                  </button>
                </div>
              </div>
            </div>

            <div className={mode === SIGNATURE_MODES.TYPE ? "grid gap-2" : "hidden"}>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground">Signature text</span>
                <input
                  id="sig-text"
                  value={typeText}
                  onChange={(event) => setTypeText(event.target.value)}
                  placeholder="Your signature"
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted"
                />
              </label>
              <p className="text-xs text-muted">The text is rendered with Dancing Script when you sign the PDF.</p>
            </div>

            <div className={mode === SIGNATURE_MODES.UPLOAD ? "grid gap-2" : "hidden"}>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground">Signature image</span>
                <input
                  id="sig-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    if (file && !isValidImageFile(file)) {
                      toast.error("Signature image must be PNG or JPG.");
                      event.target.value = "";
                      setUploadFile(null);
                      return;
                    }
                    setUploadFile(file);
                  }}
                  className="block w-full cursor-pointer rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </label>
              <p className="text-xs text-muted">PNG, JPG, or JPEG only. JPG files are normalized to PNG before embedding.</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground">Page count</span>
                <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted">
                  {pageCount} page{pageCount === 1 ? "" : "s"}
                </div>
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                id="sign-btn"
                type="button"
                onClick={() => void handleSign()}
                disabled={isProcessing || !hasPdf}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessing ? "Signing..." : "Sign PDF"}
              </button>

              <div className="text-sm text-muted">
                {pdfFile ? `${pdfFile.name} | Page ${pageNumber}` : "Choose a PDF to begin."}
              </div>
            </div>
          </div>
        </div>

        {isProcessing && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" aria-hidden />
              <p className="text-sm font-semibold text-foreground">{stage}</p>
            </div>
            <p className="mt-2 text-sm text-muted">Please keep this tab open until the download starts.</p>
          </div>
        )}

        {status === "done" && (
          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-sm">
            <p className="font-semibold text-foreground">Download started</p>
            <p className="mt-1 text-sm text-muted">Your signed PDF should begin downloading automatically.</p>
          </div>
        )}

        {status === "error" && errorMessage && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">Signing failed</p>
                <p className="mt-1 text-sm text-muted">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
