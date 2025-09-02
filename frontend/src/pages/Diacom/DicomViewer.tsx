import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneMath from "cornerstone-math";
import * as dicomParser from "dicom-parser";
import * as Hammer from "hammerjs";
import TagsTable from "./TagsTable";
import {
  Tabs,
  Tab,
  Button,
  ButtonGroup,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
// import { BSE_URL } from "../Constant";

const getAuthHeader = (): { Authorization: string } => {
  const raw = localStorage.getItem("xpert_token") || "";
  if (!raw) return { Authorization: "" };
  const token = raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
  return { Authorization: token };
};

type Props = {
  dicomId: number;
  onBack: () => void;
};

interface ViewportState {
  scale: number;
  translation?: { x: number; y: number };
  rotation?: number;
  hflip?: boolean;
  vflip?: boolean;
  voi?: {
    windowWidth: number;
    windowCenter: number;
  };
  invert?: boolean;
}

interface WindowPreset {
  name: string;
  windowWidth: number;
  windowCenter: number;
}

interface MousePosition {
  x: number;
  y: number;
  pixelValue?: number;
}

interface ViewportLayout {
  rows: number;
  cols: number;
  total: number;
}

const windowPresets: WindowPreset[] = [
  { name: "Soft Tissue", windowWidth: 400, windowCenter: 50 },
  { name: "Lung", windowWidth: 1500, windowCenter: -600 },
  { name: "Liver", windowWidth: 150, windowCenter: 90 },
  { name: "Bone", windowWidth: 2500, windowCenter: 480 },
  { name: "Brain", windowWidth: 80, windowCenter: 40 },
  { name: "Subdural", windowWidth: 130, windowCenter: 50 },
  { name: "Stroke", windowWidth: 40, windowCenter: 40 },
];

const viewportLayouts: ViewportLayout[] = [
  { rows: 1, cols: 1, total: 1 },
  { rows: 1, cols: 2, total: 2 },
  { rows: 2, cols: 2, total: 4 },
  { rows: 3, cols: 3, total: 9 },
];

let cornerstoneInitialized = false;

const initializeCornerstone = () => {
  if (cornerstoneInitialized) return;

  try {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    cornerstoneTools.init({
      mouseEnabled: true,
      touchEnabled: true,
      globalToolSyncEnabled: true,
      showSVGCursors: true,
    });

    const fontFamily = "Arial, Helvetica, sans-serif";
    cornerstoneTools.textStyle.setFont(`14px ${fontFamily}`);
    cornerstoneTools.toolStyle.setToolWidth(2);
    cornerstoneTools.toolColors.setToolColor("rgb(255, 255, 0)");
    cornerstoneTools.toolColors.setActiveColor("rgb(0, 255, 0)");

    if (cornerstoneTools.store && cornerstoneTools.store.state) {
      cornerstoneTools.store.state.touchProximity = 40;
    }

    cornerstoneWADOImageLoader.webWorkerManager.initialize({
      maxWebWorkers: navigator.hardwareConcurrency || 1,
      startWebWorkersOnDemand: true,
      taskConfiguration: {
        decodeTask: {
          initializeCodecsOnStartup: false,
          usePDFJS: false,
          strict: false,
        },
      },
    });

    cornerstoneInitialized = true;
    console.log("Cornerstone initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Cornerstone:", error);
    throw error;
  }
};

const DicomViewer: React.FC<Props> = ({ dicomId, onBack }) => {
  const elementRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [tags, setTags] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string>("viewer");
  const [activeTool, setActiveTool] = useState<string>("Wwwc");
  const [viewport, setViewport] = useState<ViewportState | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [imageInfo, setImageInfo] = useState<any>(null);
  const [cineEnabled, setCineEnabled] = useState(false);
  const [cineInterval, setCineInterval] = useState<NodeJS.Timeout | null>(null);
  const [cineSpeed, setCineSpeed] = useState(200);
  const [currentLayout, setCurrentLayout] = useState<ViewportLayout>(
    viewportLayouts[0]
  );
  const [activeViewport, setActiveViewport] = useState(0);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [showReferenceLines, setShowReferenceLines] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [showHistogram, setShowHistogram] = useState(false);
  const [histogramData, setHistogramData] = useState<number[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(1);
  const [imageStack, setImageStack] = useState<any[]>([]);
  const [showTextModal, setShowTextModal] = useState(false);
  const [textAnnotation, setTextAnnotation] = useState("");

  useEffect(() => {
    try {
      initializeCornerstone();
      cornerstoneWADOImageLoader.configure({
        beforeSend: (xhr: XMLHttpRequest) => {
          const h = getAuthHeader();
          if (h.Authorization) {
            xhr.setRequestHeader("Authorization", h.Authorization);
          }
        },
      });
      setInitialized(true);
    } catch (err) {
      console.error("Initialization error:", err);
      setError("Failed to initialize DICOM viewer");
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;

      switch (e.key.toLowerCase()) {
        case "w":
          e.preventDefault();
          handleToolChange("Wwwc");
          break;
        case "p":
          e.preventDefault();
          handleToolChange("Pan");
          break;
        case "z":
          e.preventDefault();
          handleToolChange("Zoom");
          break;
        case "l":
          e.preventDefault();
          handleToolChange("Length");
          break;
        case "a":
          e.preventDefault();
          handleToolChange("Angle");
          break;
        case "m":
          e.preventDefault();
          handleToolChange("Magnify");
          break;
        case "t":
          e.preventDefault();
          handleToolChange("TextMarker");
          break;
        case "r":
          e.preventDefault();
          resetViewport();
          break;
        case "i":
          e.preventDefault();
          invertImage();
          break;
        case " ":
          e.preventDefault();
          toggleCine();
          break;
        case "arrowup":
          e.preventDefault();
          nextFrame();
          break;
        case "arrowdown":
          e.preventDefault();
          previousFrame();
          break;
        case "delete":
          e.preventDefault();
          clearAnnotations();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeTool, currentFrame]);

  useEffect(() => {
    if (!initialized) return;

    let imageId: string | null = null;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers = getAuthHeader();

        const tagsResp = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dicom/${dicomId}/tags`,
          { headers }
        );
        if (cancelled) return;
        setTags(tagsResp.data.tags ?? {});

        const fileResp = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dicom/${dicomId}/download`,
          {
            responseType: "arraybuffer",
            headers,
          }
        );
        if (cancelled) return;

        const arrayBuffer = fileResp.data as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: "application/dicom" });
        imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(blob);

        const image = await cornerstone.loadImage(imageId);
        if (cancelled) {
          try {
            if (imageId) {
              cornerstoneWADOImageLoader.wadouri.fileManager.remove(imageId);
            }
          } catch (cleanupError) {
            console.warn("Cleanup error:", cleanupError);
          }
          return;
        }

        setImageInfo(image);
        setImageStack([image]);

        if (image.data && image.data.string && image.data.string("x00280008")) {
          const frames = parseInt(image.data.string("x00280008"), 10);
          setTotalFrames(frames || 1);
        }

        for (let i = 0; i < currentLayout.total; i++) {
          const element = elementRefs.current[i];
          if (element) {
            cornerstone.enable(element);
            cornerstone.displayImage(element, image);
            setupTools(element);
            setupEventListeners(element, i);
          }
        }

        generateHistogram(image);
      } catch (err: any) {
        console.error("DicomViewer error:", err);
        setError(err?.message || "Failed to load DICOM");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      stopCine();
      for (let i = 0; i < currentLayout.total; i++) {
        const element = elementRefs.current[i];
        if (element) {
          try {
            cornerstone.disable(element);
          } catch (cleanupError) {
            console.warn("Element cleanup error:", cleanupError);
          }
        }
      }
      if (imageId) {
        try {
          cornerstoneWADOImageLoader.wadouri.fileManager.remove(imageId);
        } catch (cleanupError) {
          console.warn("Image cleanup error:", cleanupError);
        }
      }
    };
  }, [dicomId, initialized, currentLayout]);

  const setupEventListeners = (
    element: HTMLDivElement,
    viewportIndex: number
  ) => {
    const onImageRendered = () => {
      if (viewportIndex === activeViewport) {
        try {
          const newViewport = cornerstone.getViewport(element);
          setViewport(newViewport);
        } catch (err) {
          console.warn("Viewport update error:", err);
        }
      }
    };

    const onMouseMove = (e: any) => {
      if (
        element &&
        e.detail &&
        e.detail.currentPoints &&
        viewportIndex === activeViewport
      ) {
        try {
          const canvasPos = cornerstone.pageToPixel(
            element,
            e.detail.currentPoints.page.x,
            e.detail.currentPoints.page.y
          );

          const pixelData = cornerstone.getPixels(
            element,
            Math.round(canvasPos.x),
            Math.round(canvasPos.y),
            1,
            1
          );

          setMousePosition({
            x: Math.round(canvasPos.x),
            y: Math.round(canvasPos.y),
            pixelValue: pixelData ? pixelData[0] : undefined,
          });
        } catch (err) {
          setMousePosition({
            x: 0,
            y: 0,
          });
        }
      }
    };

    const onViewportChanged = (e: any) => {
      if (syncEnabled && viewportIndex === activeViewport) {
        syncViewports(viewportIndex, e.detail);
      }
    };

    const onMouseClick = () => {
      setActiveViewport(viewportIndex);
    };

    element.addEventListener("cornerstoneimagerendered", onImageRendered);
    element.addEventListener("cornerstonetoolsmousemove", onMouseMove);
    element.addEventListener("cornerstoneviewportchanged", onViewportChanged);
    element.addEventListener("mousedown", onMouseClick);

    onImageRendered();
  };

  const syncViewports = (sourceIndex: number, viewportData: any) => {
    for (let i = 0; i < currentLayout.total; i++) {
      if (i !== sourceIndex) {
        const element = elementRefs.current[i];
        if (element) {
          try {
            const currentViewport = cornerstone.getViewport(element);
            if (activeTool === "Wwwc") {
              currentViewport.voi = viewportData.voi;
            } else if (activeTool === "Pan" || activeTool === "Zoom") {
              currentViewport.scale = viewportData.scale;
              currentViewport.translation = viewportData.translation;
            }
            cornerstone.setViewport(element, currentViewport);
          } catch (err) {
            console.warn("Sync error:", err);
          }
        }
      }
    }
  };

  const setupTools = (element: HTMLDivElement) => {
    try {
      const WwwcTool = cornerstoneTools.WwwcTool;
      const PanTool = cornerstoneTools.PanTool;
      const ZoomTouchPinchTool = cornerstoneTools.ZoomTouchPinchTool;
      const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
      const LengthTool = cornerstoneTools.LengthTool;
      const AngleTool = cornerstoneTools.AngleTool;
      const FreehandRoiTool = cornerstoneTools.FreehandRoiTool;
      const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
      const RectangleRoiTool = cornerstoneTools.RectangleRoiTool;
      const CircleRoiTool = cornerstoneTools.CircleRoiTool;
      const BidirectionalTool = cornerstoneTools.BidirectionalTool;
      const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
      const ProbeTool = cornerstoneTools.ProbeTool;
      const MagnifyTool = cornerstoneTools.MagnifyTool;
      const CrosshairsTool = cornerstoneTools.CrosshairsTool;
      const ZoomTool = cornerstoneTools.ZoomTool;
      const StackScrollMouseWheelTool =
        cornerstoneTools.StackScrollMouseWheelTool;
      const ReferenceLinesTool = cornerstoneTools.ReferenceLinesTool;
      const TextMarkerTool = cornerstoneTools.TextMarkerTool;
      const EraserTool = cornerstoneTools.EraserTool;
      const RotateTouchTool = cornerstoneTools.RotateTouchTool;
      const DragProbeTool = cornerstoneTools.DragProbeTool;

      cornerstoneTools.addToolForElement(element, WwwcTool);
      cornerstoneTools.addToolForElement(element, PanTool);
      cornerstoneTools.addToolForElement(element, ZoomTouchPinchTool);
      cornerstoneTools.addToolForElement(element, ZoomMouseWheelTool);
      cornerstoneTools.addToolForElement(element, LengthTool);
      cornerstoneTools.addToolForElement(element, AngleTool);
      cornerstoneTools.addToolForElement(element, FreehandRoiTool);
      cornerstoneTools.addToolForElement(element, EllipticalRoiTool);
      cornerstoneTools.addToolForElement(element, RectangleRoiTool);
      cornerstoneTools.addToolForElement(element, CircleRoiTool);
      cornerstoneTools.addToolForElement(element, BidirectionalTool);
      cornerstoneTools.addToolForElement(element, ArrowAnnotateTool);
      cornerstoneTools.addToolForElement(element, ProbeTool);
      cornerstoneTools.addToolForElement(element, MagnifyTool);
      cornerstoneTools.addToolForElement(element, CrosshairsTool);
      cornerstoneTools.addToolForElement(element, ZoomTool);
      cornerstoneTools.addToolForElement(element, StackScrollMouseWheelTool);

      if (TextMarkerTool) {
        cornerstoneTools.addToolForElement(element, TextMarkerTool);
      }
      if (EraserTool) {
        cornerstoneTools.addToolForElement(element, EraserTool);
      }
      if (RotateTouchTool) {
        cornerstoneTools.addToolForElement(element, RotateTouchTool);
      }
      if (DragProbeTool) {
        cornerstoneTools.addToolForElement(element, DragProbeTool);
      }
      if (ReferenceLinesTool) {
        cornerstoneTools.addToolForElement(element, ReferenceLinesTool);
      }

      cornerstoneTools.setToolActiveForElement(element, "ZoomMouseWheel", {});
      cornerstoneTools.setToolActiveForElement(element, "Wwwc", {
        mouseButtonMask: 1,
      });

      if (showReferenceLines && ReferenceLinesTool) {
        cornerstoneTools.setToolEnabledForElement(
          element,
          "ReferenceLines",
          {}
        );
      }

      console.log("Tools setup completed");
    } catch (err) {
      console.error("Error setting up tools:", err);
    }
  };

  const handleToolChange = (toolName: string) => {
    for (let i = 0; i < currentLayout.total; i++) {
      const element = elementRefs.current[i];
      if (element) {
        try {
          if (activeTool) {
            cornerstoneTools.setToolDisabledForElement(element, activeTool);
          }
          cornerstoneTools.setToolActiveForElement(element, toolName, {
            mouseButtonMask: 1,
          });
        } catch (err) {
          console.error("Error changing tool:", err);
        }
      }
    }
    setActiveTool(toolName);
  };

  const resetViewport = () => {
    for (let i = 0; i < currentLayout.total; i++) {
      const element = elementRefs.current[i];
      if (element) {
        try {
          cornerstone.reset(element);
        } catch (err) {
          console.error("Error resetting viewport:", err);
        }
      }
    }
  };

  const zoomIn = () => {
    const element = elementRefs.current[activeViewport];
    if (element) {
      try {
        const currentViewport = cornerstone.getViewport(element);
        currentViewport.scale += 0.25;
        cornerstone.setViewport(element, currentViewport);
      } catch (err) {
        console.error("Error zooming in:", err);
      }
    }
  };

  const zoomOut = () => {
    const element = elementRefs.current[activeViewport];
    if (element) {
      try {
        const currentViewport = cornerstone.getViewport(element);
        currentViewport.scale = Math.max(0.1, currentViewport.scale - 0.25);
        cornerstone.setViewport(element, currentViewport);
      } catch (err) {
        console.error("Error zooming out:", err);
      }
    }
  };

  const zoomToFit = () => {
    const element = elementRefs.current[activeViewport];
    if (element) {
      try {
        cornerstone.fitToWindow(element);
      } catch (err) {
        console.error("Error fitting to window:", err);
      }
    }
  };

  const invertImage = () => {
    const element = elementRefs.current[activeViewport];
    if (element) {
      try {
        const currentViewport = cornerstone.getViewport(element);
        currentViewport.invert = !currentViewport.invert;
        cornerstone.setViewport(element, currentViewport);
      } catch (err) {
        console.error("Error inverting image:", err);
      }
    }
  };

  const rotateImage = (angle: number) => {
    const element = elementRefs.current[activeViewport];
    if (element) {
      try {
        const currentViewport = cornerstone.getViewport(element);
        currentViewport.rotation = (currentViewport.rotation || 0) + angle;
        cornerstone.setViewport(element, currentViewport);
      } catch (err) {
        console.error("Error rotating image:", err);
      }
    }
  };

  const flipHorizontal = () => {
    const element = elementRefs.current[activeViewport];
    if (element) {
      try {
        const currentViewport = cornerstone.getViewport(element);
        currentViewport.hflip = !currentViewport.hflip;
        cornerstone.setViewport(element, currentViewport);
      } catch (err) {
        console.error("Error flipping horizontal:", err);
      }
    }
  };

  const flipVertical = () => {
    const element = elementRefs.current[activeViewport];
    if (element) {
      try {
        const currentViewport = cornerstone.getViewport(element);
        currentViewport.vflip = !currentViewport.vflip;
        cornerstone.setViewport(element, currentViewport);
      } catch (err) {
        console.error("Error flipping vertical:", err);
      }
    }
  };

  const applyWindowPreset = (preset: WindowPreset) => {
    for (let i = 0; i < currentLayout.total; i++) {
      const element = elementRefs.current[i];
      if (element) {
        try {
          const currentViewport = cornerstone.getViewport(element);
          currentViewport.voi = {
            windowWidth: preset.windowWidth,
            windowCenter: preset.windowCenter,
          };
          cornerstone.setViewport(element, currentViewport);
        } catch (err) {
          console.error("Error applying preset:", err);
        }
      }
    }
  };

  const clearAnnotations = () => {
    for (let i = 0; i < currentLayout.total; i++) {
      const element = elementRefs.current[i];
      if (element) {
        try {
          const toolStateManager =
            cornerstoneTools.globalImageIdSpecificToolStateManager;
          toolStateManager.clear(element);
          cornerstone.updateImage(element);
        } catch (err) {
          console.error("Error clearing annotations:", err);
        }
      }
    }
  };

  const exportImage = () => {
    const element = elementRefs.current[activeViewport];
    if (element) {
      try {
        const canvas = element.querySelector("canvas") as HTMLCanvasElement;
        if (canvas) {
          const link = document.createElement("a");
          link.download = `dicom-export-${dicomId}.png`;
          link.href = canvas.toDataURL();
          link.click();
        }
      } catch (err) {
        console.error("Error exporting image:", err);
      }
    }
  };

  const captureScreenshot = () => {
    const element = elementRefs.current[activeViewport];
    if (element) {
      try {
        const canvas = element.querySelector("canvas") as HTMLCanvasElement;
        if (canvas) {
          const overlayCanvas = document.createElement("canvas");
          overlayCanvas.width = canvas.width;
          overlayCanvas.height = canvas.height;
          const ctx = overlayCanvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(canvas, 0, 0);
            const link = document.createElement("a");
            link.download = `screenshot-${dicomId}-${Date.now()}.png`;
            link.href = overlayCanvas.toDataURL();
            link.click();
          }
        }
      } catch (err) {
        console.error("Error capturing screenshot:", err);
      }
    }
  };

  const toggleCine = () => {
    if (cineEnabled) {
      stopCine();
    } else {
      startCine();
    }
  };

  const startCine = () => {
    if (totalFrames <= 1) return;
    setCineEnabled(true);
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, cineSpeed);
    setCineInterval(interval);
  };

  const stopCine = () => {
    setCineEnabled(false);
    if (cineInterval) {
      clearInterval(cineInterval);
      setCineInterval(null);
    }
  };

  const nextFrame = () => {
    if (totalFrames > 1) {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }
  };

  const previousFrame = () => {
    if (totalFrames > 1) {
      setCurrentFrame((prev) => (prev - 1 + totalFrames) % totalFrames);
    }
  };

  const changeLayout = (layout: ViewportLayout) => {
    setCurrentLayout(layout);
    setActiveViewport(0);
    stopCine();
  };

  const toggleReferenceLines = () => {
    setShowReferenceLines(!showReferenceLines);
    for (let i = 0; i < currentLayout.total; i++) {
      const element = elementRefs.current[i];
      if (element) {
        try {
          if (!showReferenceLines) {
            cornerstoneTools.setToolEnabledForElement(
              element,
              "ReferenceLines",
              {}
            );
          } else {
            cornerstoneTools.setToolDisabledForElement(
              element,
              "ReferenceLines"
            );
          }
        } catch (err) {
          console.warn("Reference lines error:", err);
        }
      }
    }
  };

  const generateHistogram = useCallback((image: any) => {
    if (!image || !image.getPixelData) return;

    try {
      const pixelData = image.getPixelData();
      const histogram = new Array(256).fill(0);

      for (let i = 0; i < pixelData.length; i++) {
        const value = Math.floor(
          ((pixelData[i] - image.minPixelValue) * 255) /
            (image.maxPixelValue - image.minPixelValue)
        );
        if (value >= 0 && value < 256) {
          histogram[value]++;
        }
      }

      setHistogramData(histogram);
    } catch (err) {
      console.warn("Histogram generation error:", err);
    }
  }, []);

  const addTextAnnotation = () => {
    setShowTextModal(true);
  };

  const handleTextSubmit = () => {
    if (textAnnotation.trim()) {
      handleToolChange("TextMarker");
      setShowTextModal(false);
      setTextAnnotation("");
    }
  };

  if (!initialized) {
    return (
      <div className="p-3">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">🔧 Initializing DICOM tools...</p>
        </div>
      </div>
    );
  }

  const overlayStyle = {
    position: "absolute" as const,
    color: darkTheme ? "#00ff00" : "#ffffff",
    fontSize: "12px",
    fontFamily: "monospace",
    backgroundColor: darkTheme ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.6)",
    padding: "4px 8px",
    borderRadius: "4px",
    pointerEvents: "none" as const,
    zIndex: 10,
  };

  const containerStyle = {
    backgroundColor: darkTheme ? "#1a1a1a" : "#ffffff",
    color: darkTheme ? "#ffffff" : "#000000",
    minHeight: "100vh",
  };

  const viewerContainerStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${currentLayout.cols}, 1fr)`,
    gridTemplateRows: `repeat(${currentLayout.rows}, 1fr)`,
    gap: "2px",
    height: "600px",
    width: "100%",
    maxWidth: "1200px",
  };

  return (
    <div
      className="p-3"
      style={{ ...containerStyle, marginTop: "-50px", marginLeft: "-20px" }}
    >
      <div className="d-flex align-items-center gap-2 mb-3">
        {loading && <small className="text-muted">Loading...</small>}
        {error && <small className="text-danger ms-2">{error}</small>}
      </div>

      <div
        className="mb-3"
        style={{
          backgroundColor: darkTheme ? "#2a2a2a" : "#f8f9fa",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #dee2e6",
        }}
      >
        <Row className="mb-2">
          <Col md={6}>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Window/Level Tool (W)</Tooltip>}
              >
                <Button
                  variant={
                    activeTool === "Wwwc" ? "primary" : "outline-primary"
                  }
                  size="sm"
                  onClick={() => handleToolChange("Wwwc")}
                >
                  🪟 W/L
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Pan Tool (P)</Tooltip>}
              >
                <Button
                  variant={activeTool === "Pan" ? "primary" : "outline-primary"}
                  size="sm"
                  onClick={() => handleToolChange("Pan")}
                >
                  ✋ Pan
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Zoom Tool (Z)</Tooltip>}
              >
                <Button
                  variant={
                    activeTool === "Zoom" ? "primary" : "outline-primary"
                  }
                  size="sm"
                  onClick={() => handleToolChange("Zoom")}
                >
                  🔍 Zoom
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Magnify Tool (M)</Tooltip>}
              >
                <Button
                  variant={
                    activeTool === "Magnify" ? "primary" : "outline-primary"
                  }
                  size="sm"
                  onClick={() => handleToolChange("Magnify")}
                >
                  🔎 Magnify
                </Button>
              </OverlayTrigger>

              <Dropdown>
                <Dropdown.Toggle variant="outline-info" size="sm">
                  📏 Measure
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleToolChange("Length")}>
                    📏 Length (L)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleToolChange("Angle")}>
                    📐 Angle (A)
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleToolChange("Bidirectional")}
                  >
                    ↔️ Bidirectional
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleToolChange("Probe")}>
                    📍 Probe
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleToolChange("DragProbe")}>
                    📍 Drag Probe
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="outline-warning" size="sm">
                  🎨 ROI
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => handleToolChange("FreehandRoi")}
                  >
                    ✏️ Freehand
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleToolChange("RectangleRoi")}
                  >
                    ⬛ Rectangle
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleToolChange("EllipticalRoi")}
                  >
                    🟢 Ellipse
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleToolChange("CircleRoi")}>
                    ⭕ Circle
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2 justify-content-end flex-wrap">
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                  🏗️ Layout
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {viewportLayouts.map((layout, idx) => (
                    <Dropdown.Item
                      key={idx}
                      onClick={() => changeLayout(layout)}
                    >
                      {layout.rows}x{layout.cols}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Sync Viewports</Tooltip>}
              >
                <Button
                  variant={syncEnabled ? "success" : "outline-secondary"}
                  size="sm"
                  onClick={() => setSyncEnabled(!syncEnabled)}
                >
                  🔄 Sync
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Reference Lines</Tooltip>}
              >
                <Button
                  variant={showReferenceLines ? "success" : "outline-secondary"}
                  size="sm"
                  onClick={toggleReferenceLines}
                >
                  ➕ Ref
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Toggle Theme</Tooltip>}
              >
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setDarkTheme(!darkTheme)}
                >
                  {darkTheme ? "🌞" : "🌙"}
                </Button>
              </OverlayTrigger>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <ButtonGroup>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Zoom In</Tooltip>}
                >
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={zoomIn}
                  >
                    🔍➕
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Zoom Out</Tooltip>}
                >
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={zoomOut}
                  >
                    🔍➖
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Fit to Window</Tooltip>}
                >
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={zoomToFit}
                  >
                    📐 Fit
                  </Button>
                </OverlayTrigger>
              </ButtonGroup>

              <Dropdown>
                <Dropdown.Toggle variant="outline-info" size="sm">
                  🪟 Presets
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {windowPresets.map((preset, idx) => (
                    <Dropdown.Item
                      key={idx}
                      onClick={() => applyWindowPreset(preset)}
                    >
                      {preset.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                  🔄 Transform
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => rotateImage(90)}>
                    🔄 Rotate 90°
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => rotateImage(-90)}>
                    🔄 Rotate -90°
                  </Dropdown.Item>
                  <Dropdown.Item onClick={flipHorizontal}>
                    ↔️ Flip H
                  </Dropdown.Item>
                  <Dropdown.Item onClick={flipVertical}>
                    ↕️ Flip V
                  </Dropdown.Item>
                  <Dropdown.Item onClick={invertImage}>
                    🌗 Invert (I)
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="outline-success" size="sm">
                  📝 Annotate
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => handleToolChange("ArrowAnnotate")}
                  >
                    ➡️ Arrow
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2 justify-content-end flex-wrap">
              {totalFrames > 1 && (
                <ButtonGroup>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={previousFrame}
                  >
                    ⬇️
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={nextFrame}
                  >
                    ⬆️
                  </Button>
                  <Button
                    variant={cineEnabled ? "success" : "outline-secondary"}
                    size="sm"
                    onClick={toggleCine}
                  >
                    {cineEnabled ? "⏸️" : "▶️"}
                  </Button>
                </ButtonGroup>
              )}

              <ButtonGroup>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Screenshot</Tooltip>}
                >
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={captureScreenshot}
                  >
                    📸
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Export Image</Tooltip>}
                >
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={exportImage}
                  >
                    💾
                  </Button>
                </OverlayTrigger>
              </ButtonGroup>

              <ButtonGroup>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Show Histogram</Tooltip>}
                >
                  <Button
                    variant={showHistogram ? "success" : "outline-secondary"}
                    size="sm"
                    onClick={() => setShowHistogram(!showHistogram)}
                  >
                    📊
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Clear Annotations (Del)</Tooltip>}
                >
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={clearAnnotations}
                  >
                    🗑️
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Reset View (R)</Tooltip>}
                >
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={resetViewport}
                  >
                    🔄
                  </Button>
                </OverlayTrigger>
              </ButtonGroup>
            </div>
          </Col>
        </Row>
      </div>

      <Tabs
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k || "viewer")}
        className="mb-3"
      >
        <Tab eventKey="viewer" title="DICOM Viewer">
          <div style={{ position: "relative" }}>
            <div style={viewerContainerStyle} className="mx-auto">
              {Array.from({ length: currentLayout.total }).map((_, index) => (
                <div
                  key={index}
                  ref={(el) => (elementRefs.current[index] = el)}
                  style={{
                    width: "100%",
                    height: "100%",
                    background: darkTheme ? "#000000" : "#000000",
                    border: `2px solid ${
                      index === activeViewport ? "#007bff" : "#666666"
                    }`,
                    borderRadius: "4px",
                    cursor: activeTool === "Pan" ? "grab" : "crosshair",
                    position: "relative",
                  }}
                  onClick={() => setActiveViewport(index)}
                />
              ))}
            </div>

            <div style={{ ...overlayStyle, top: 10, left: 10 }}>
              <div>
                👤 Patient: {tags?.["0010,0010"]?.Value?.[0] || "Unknown"}
              </div>
              <div>📚 Study: {tags?.["0020,0010"]?.Value?.[0] || "N/A"}</div>
              <div>🏥 Modality: {tags?.["0008,0060"]?.Value?.[0] || "N/A"}</div>
              <div>
                🖼️ Viewport: {activeViewport + 1}/{currentLayout.total}
              </div>
            </div>

            <div style={{ ...overlayStyle, top: 10, right: 10 }}>
              <div>🔍 Zoom: {viewport?.scale?.toFixed(2) ?? "1.00"}x</div>
              <div>
                🪟 WW: {viewport?.voi?.windowWidth?.toFixed(0) ?? "N/A"}
              </div>
              <div>
                🎯 WC: {viewport?.voi?.windowCenter?.toFixed(0) ?? "N/A"}
              </div>
              {totalFrames > 1 && (
                <div>
                  🎬 Frame: {currentFrame + 1}/{totalFrames}
                </div>
              )}
            </div>

            <div style={{ ...overlayStyle, bottom: 10, left: 10 }}>
              <div>📍 X: {mousePosition.x}</div>
              <div>📍 Y: {mousePosition.y}</div>
              {mousePosition.pixelValue !== undefined && (
                <div>🩻 HU: {mousePosition.pixelValue}</div>
              )}
              <div>🎯 Tool: {activeTool}</div>
            </div>

            <div style={{ ...overlayStyle, bottom: 10, right: 10 }}>
              {imageInfo && (
                <>
                  <div>
                    📐 {imageInfo.width} × {imageInfo.height}
                  </div>
                  <div>
                    🔢 Bits: {imageInfo.color ? "RGB" : imageInfo.slope || 1}
                  </div>
                  <div>🆔 ID: {dicomId}</div>
                </>
              )}
              <div>L/R A/P markers would appear here</div>
            </div>

            {loading && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.9)",
                  padding: "20px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div className="spinner-border text-light mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mb-0">📥 Loading DICOM Image...</p>
              </div>
            )}

            {error && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  backgroundColor: "rgba(220, 53, 69, 0.9)",
                  padding: "20px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                ❌ {error}
              </div>
            )}
          </div>

          <div className="mt-3">
            <Row>
              <Col md={showHistogram ? 6 : 8}>
                <h6>📖 Keyboard Shortcuts</h6>
                <small className="text-muted">
                  <strong>W:</strong> Window/Level • <strong>P:</strong> Pan •{" "}
                  <strong>Z:</strong> Zoom • <strong>L:</strong> Length •{" "}
                  <strong>A:</strong> Angle • <strong>M:</strong> Magnify •{" "}
                  <strong>T:</strong> Text
                  <br />
                  <strong>R:</strong> Reset • <strong>I:</strong> Invert •{" "}
                  <strong>Space:</strong> Play/Pause Cine •{" "}
                  <strong>Del:</strong> Clear
                  <br />
                  <strong>↑↓:</strong> Navigate frames
                </small>
              </Col>
              {showHistogram && (
                <Col md={6}>
                  <h6>📊 Histogram</h6>
                  <div
                    style={{
                      height: "100px",
                      border: "1px solid #ccc",
                      padding: "5px",
                      display: "flex",
                      alignItems: "end",
                    }}
                  >
                    {histogramData.slice(0, 50).map((value, index) => (
                      <div
                        key={index}
                        style={{
                          width: "2px",
                          height: `${
                            (value / Math.max(...histogramData)) * 90
                          }px`,
                          backgroundColor: "#007bff",
                          margin: "0 1px",
                        }}
                      />
                    ))}
                  </div>
                </Col>
              )}
              <Col md={showHistogram ? 12 : 4}>
                {viewport && (
                  <div className="text-end">
                    <h6>ℹ️ Viewport Info</h6>
                    <small className="text-muted d-block">
                      Zoom: {viewport.scale?.toFixed(2) ?? "1.00"}x
                    </small>
                    <small className="text-muted d-block">
                      WW/WC: {viewport.voi?.windowWidth?.toFixed(0) ?? "N/A"}/
                      {viewport.voi?.windowCenter?.toFixed(0) ?? "N/A"}
                    </small>
                    <small className="text-muted d-block">
                      Rotation: {viewport.rotation?.toFixed(0) ?? "0"}°
                    </small>
                    <small className="text-muted d-block">
                      H-Flip: {viewport.hflip ? "Yes" : "No"} • V-Flip:{" "}
                      {viewport.vflip ? "Yes" : "No"}
                    </small>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Tab>

        <Tab eventKey="tags" title="🏷️ DICOM Tags">
          <div style={{ maxHeight: 600, overflowY: "auto" }}>
            <h6 className="mb-3">📋 DICOM Metadata</h6>
            {!tags && !loading && (
              <div className="text-muted text-center">
                <div>📄 No tags found</div>
              </div>
            )}
            {tags && <TagsTable data={tags} />}
          </div>
        </Tab>
      </Tabs>

      <Modal show={showTextModal} onHide={() => setShowTextModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Text Annotation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Annotation Text</Form.Label>
              <Form.Control
                type="text"
                value={textAnnotation}
                onChange={(e) => setTextAnnotation(e.target.value)}
                placeholder="Enter annotation text..."
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTextModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleTextSubmit}>
            Add Text
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DicomViewer;
