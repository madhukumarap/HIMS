// madhukumar ap
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
  ProgressBar,
  Badge,
  ListGroup,
} from "react-bootstrap";
import "./MainDicomViewer.css";
import { FaArrowLeft, FaArrowRight, FaPause, FaPlay } from "react-icons/fa";
import AuthService from "../../services/auth.service";
const getAuthHeader = (): { Authorization: string } => {
  const raw = localStorage.getItem("xpert_token") || "";
  if (!raw) return { Authorization: "" };
  const token = raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
  return { Authorization: token };
};

interface ConsultationFile {
  id: number;
  original_name: string;
  file_name: string;
  file_path?: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  is_dicom: boolean;
  orthanc_instance_id?: string;
  orthanc_study_id?: string;
  dicom_metadata?: any;
  consultation_id: number;
  tenant_id: number;
}

type Props = {
  consultationFiles: ConsultationFile[];
  dicomId: number;
  onBack?: () => void;
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

interface SeriesImage {
  id: number;
  image: any;
  imageId: string;
  metadata?: any;
  fileName: string;
}

const windowPresets: WindowPreset[] = [
  { name: "Soft Tissue", windowWidth: 400, windowCenter: 50 },
  { name: "Lung", windowWidth: 1500, windowCenter: -600 },
  { name: "Liver", windowWidth: 150, windowCenter: 90 },
  { name: "Bone", windowWidth: 2500, windowCenter: 480 },
  { name: "Brain", windowWidth: 80, windowCenter: 40 },
  { name: "Subdural", windowWidth: 130, windowCenter: 50 },
  { name: "Stroke", windowWidth: 40, windowCenter: 40 },
  { name: "Abdomen", windowWidth: 350, windowCenter: 50 },
  { name: "Mediastinum", windowWidth: 350, windowCenter: 50 },
  { name: "Spine", windowWidth: 1000, windowCenter: 400 },
];

const viewportLayouts: ViewportLayout[] = [
  { rows: 1, cols: 1, total: 1 },
  { rows: 1, cols: 2, total: 2 },
  { rows: 2, cols: 2, total: 4 },
];

const orientationPresets = [
  { name: "Axial", rotation: 0, hflip: false, vflip: false },
  { name: "Sagittal", rotation: 90, hflip: false, vflip: false },
  { name: "Coronal", rotation: 0, hflip: false, vflip: true },
  { name: "Oblique", rotation: 45, hflip: false, vflip: false },
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

const MainDicomViewer: React.FC<Props> = ({
  consultationFiles,
  dicomId,
  onBack,
}) => {
  const elementRefs = useRef<(HTMLDivElement | null)[]>([]);
  const compareLeftRef = useRef<HTMLDivElement | null>(null);
  const compareRightRef = useRef<HTMLDivElement | null>(null);

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
  const [showHistogram, setShowHistogram] = useState(false);
  const [histogramData, setHistogramData] = useState<number[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(1);
  const [showTextModal, setShowTextModal] = useState(false);
  const [textAnnotation, setTextAnnotation] = useState("");

  const [seriesImages, setSeriesImages] = useState<SeriesImage[]>([]);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [playInterval, setPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const [playSpeed, setPlaySpeed] = useState(1000);
  const [selectedOrientation, setSelectedOrientation] = useState("Axial");

  // Compare mode state
  const [compareMode, setCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState<number[]>([]);
  const [compareImages, setCompareImages] = useState<{
    left?: SeriesImage;
    right?: SeriesImage;
  }>({});

  const dicomFiles = consultationFiles.filter((file) => file.is_dicom);
const currentUser = AuthService.getCurrentUser();

  // Compare mode functions
  const toggleCompareMode = () => {
    if (compareMode) {
      clearCompare();
    } else {
      if (seriesImages.length > 0) {
        const currentImage = seriesImages[currentSeriesIndex];
        setCompareSelection([currentImage.id]);
        setCompareImages({ left: currentImage });
        setCompareMode(true);
      }
    }
  };

  const handleCompareSelect = (imageId: number) => {
    if (!compareMode) return;

    const image = seriesImages.find((img) => img.id === imageId);
    if (!image) return;

    let newSelection = [...compareSelection];
    let newCompareImages = { ...compareImages };

    if (compareSelection.includes(imageId)) {
      // Unselect image
      newSelection = newSelection.filter((id) => id !== imageId);

      if (newCompareImages.left?.id === imageId) {
        newCompareImages.left = newCompareImages.right;
        newCompareImages.right = undefined;
      } else if (newCompareImages.right?.id === imageId) {
        newCompareImages.right = undefined;
      }
    } else {
      // Select image
      if (newSelection.length >= 2) {
        // Replace the right image
        newSelection[1] = imageId;
        newCompareImages.right = image;
      } else {
        newSelection.push(imageId);
        if (!newCompareImages.left) {
          newCompareImages.left = image;
        } else {
          newCompareImages.right = image;
        }
      }
    }

    setCompareSelection(newSelection);
    setCompareImages(newCompareImages);
  };

  const clearCompare = () => {
    setCompareMode(false);
    setCompareSelection([]);
    setCompareImages({});
    cleanupCompareViewports();
  };

  const cleanupCompareViewports = () => {
    [compareLeftRef.current, compareRightRef.current].forEach((element) => {
      if (element) {
        try {
          cornerstone.getEnabledElement(element);
          cornerstone.disable(element);
        } catch (error) {
          // Element not enabled
        }
      }
    });
  };

  const setupCompareViewport = (element: HTMLDivElement, image: any) => {
    if (!element || !image) return;

    try {
      let isEnabled = false;
      try {
        cornerstone.getEnabledElement(element);
        isEnabled = true;
      } catch (err) {
        isEnabled = false;
      }

      if (!isEnabled) {
        cornerstone.enable(element);
      }

      cornerstone.displayImage(element, image);
      setupTools(element);
    } catch (err) {
      console.error("Compare viewport setup error:", err);
    }
  };

  useEffect(() => {
    if (compareMode && initialized) {
      setTimeout(() => {
        if (compareImages.left) {
          setupCompareViewport(
            compareLeftRef.current,
            compareImages.left.image
          );
        }
        if (compareImages.right) {
          setupCompareViewport(
            compareRightRef.current,
            compareImages.right.image
          );
        }
      }, 100);
    }
  }, [compareMode, compareImages, initialized]);

  // Rest of your existing useEffect hooks and functions remain the same...
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
      if (activeKey !== "viewer") return;
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
        case "arrowleft":
          e.preventDefault();
          previousSeries();
          break;
        case "arrowright":
          e.preventDefault();
          nextSeries();
          break;
        case "delete":
          e.preventDefault();
          clearAnnotations();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeTool, currentFrame, currentSeriesIndex, activeKey]);

  useEffect(() => {
    if (!initialized || dicomFiles.length === 0) return;

    loadSeriesImages();

    return () => {
      stopAutoPlay();
      stopCine();
      cleanupViewports();
      cleanupImageIds();
      cleanupCompareViewports();
    };
  }, [initialized, consultationFiles]);

  useEffect(() => {
    if (seriesImages.length > 0 && initialized && !compareMode) {
      setTimeout(() => {
        displayCurrentImage();
      }, 100);
    }
  }, [currentSeriesIndex, seriesImages, currentLayout, initialized]);

  // Keep all your existing functions (loadSeriesImages, displayCurrentImage, etc.)
  const loadSeriesImages = async () => {
    if (dicomFiles.length === 0) {
      setError("No DICOM files found");
      return;
    }

    setSeriesLoading(true);
    setError(null);
    setLoadingProgress(0);

    const images: SeriesImage[] = [];
    const headers = getAuthHeader();

    try {
      for (let i = 0; i < dicomFiles.length; i++) {
        const file = dicomFiles[i];
        setLoadingProgress(((i + 1) / dicomFiles.length) * 100);

        const tagsResp = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/${file.id}/tags`,
          { headers:{ Authorization: `${currentUser?.Token}`, }}
        );

        const fileResp = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/${file.id}/download`,
          {
            responseType: "arraybuffer",
            headers:{ Authorization: `${currentUser?.Token}`,
          }}
        );

        const arrayBuffer = fileResp.data as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: "application/dicom" });
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(blob);
        const image = await cornerstone.loadImage(imageId);

        images.push({
          id: file.id,
          image,
          imageId,
          metadata: tagsResp.data.tags,
          fileName: file.original_name,
        });

        if (file.id === dicomId) {
          setCurrentSeriesIndex(i);
          setTags(tagsResp.data.tags ?? {});
        }
      }

      setSeriesImages(images);

      if (images.length > 0) {
        const currentImage = images[currentSeriesIndex] || images[0];
        setImageInfo(currentImage.image);
        if (!tags && currentImage.metadata) {
          setTags(currentImage.metadata);
        }

        if (
          currentImage.image.data &&
          currentImage.image.data.string &&
          currentImage.image.data.string("x00280008")
        ) {
          const frames = parseInt(
            currentImage.image.data.string("x00280008"),
            10
          );
          setTotalFrames(frames || 1);
        }

        generateHistogram(currentImage.image);
      }
    } catch (err: any) {
      console.error("Series loading error:", err);
      setError(err?.message || "Failed to load DICOM series");
    } finally {
      setSeriesLoading(false);
      setLoadingProgress(100);
    }
  };

  const displayCurrentImage = () => {
    if (seriesImages.length === 0) return;

    const currentImage = seriesImages[currentSeriesIndex];
    if (!currentImage) return;

    setImageInfo(currentImage.image);
    setTags(currentImage.metadata || {});
    generateHistogram(currentImage.image);

    for (let i = 0; i < currentLayout.total; i++) {
      const element = elementRefs.current[i];
      if (element) {
        try {
          let isEnabled = false;
          try {
            cornerstone.getEnabledElement(element);
            isEnabled = true;
          } catch (err) {
            isEnabled = false;
          }

          if (!isEnabled) {
            cornerstone.enable(element);
          }

          cornerstone.displayImage(element, currentImage.image);
          setupTools(element);
          setupEventListeners(element, i);
        } catch (err) {
          console.error("Display error:", err);
        }
      }
    }
  };

  const cleanupViewports = () => {
    for (let i = 0; i < elementRefs.current.length; i++) {
      const element = elementRefs.current[i];
      if (element) {
        try {
          cornerstone.getEnabledElement(element);
          cornerstone.disable(element);
        } catch (cleanupError) {
          console.warn("Element cleanup error:", cleanupError);
        }
      }
    }
  };

  const cleanupImageIds = () => {
    seriesImages.forEach((seriesImage) => {
      try {
        cornerstoneWADOImageLoader.wadouri.fileManager.remove(
          seriesImage.imageId
        );
      } catch (cleanupError) {
        console.warn("ImageId cleanup error:", cleanupError);
      }
    });
  };

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
    const elements = compareMode
      ? [compareLeftRef.current, compareRightRef.current].filter((el) => el)
      : elementRefs.current.slice(0, currentLayout.total);

    elements.forEach((element) => {
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
    });
    setActiveTool(toolName);
  };

  const nextSeries = () => {
    if (seriesImages.length > 1 && !compareMode) {
      setCurrentSeriesIndex((prev) => (prev + 1) % seriesImages.length);
    }
  };

  const previousSeries = () => {
    if (seriesImages.length > 1 && !compareMode) {
      setCurrentSeriesIndex(
        (prev) => (prev - 1 + seriesImages.length) % seriesImages.length
      );
    }
  };

  const goToSeries = (index: number) => {
    if (compareMode) {
      const image = seriesImages[index];
      if (image) {
        handleCompareSelect(image.id);
      }
    } else {
      if (index >= 0 && index < seriesImages.length) {
        setCurrentSeriesIndex(index);
      }
    }
  };

  // Include all other existing functions (toggleAutoPlay, applyOrientation, resetViewport, etc.)
  const toggleAutoPlay = () => {
    if (autoPlay) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  };

  const startAutoPlay = () => {
    if (seriesImages.length <= 1) return;
    setAutoPlay(true);
    const interval = setInterval(() => {
      setCurrentSeriesIndex((prev) => (prev + 1) % seriesImages.length);
    }, playSpeed);
    setPlayInterval(interval);
  };

  const stopAutoPlay = () => {
    setAutoPlay(false);
    if (playInterval) {
      clearInterval(playInterval);
      setPlayInterval(null);
    }
  };

  const applyOrientation = (orientation: any) => {
    setSelectedOrientation(orientation.name);
    const elements = compareMode
      ? [compareLeftRef.current, compareRightRef.current].filter((el) => el)
      : elementRefs.current.slice(0, currentLayout.total);

    elements.forEach((element) => {
      if (element) {
        try {
          const currentViewport = cornerstone.getViewport(element);
          currentViewport.rotation = orientation.rotation;
          currentViewport.hflip = orientation.hflip;
          currentViewport.vflip = orientation.vflip;
          cornerstone.setViewport(element, currentViewport);
        } catch (err) {
          console.error("Error applying orientation:", err);
        }
      }
    });
  };

  const resetViewport = () => {
    const elements = compareMode
      ? [compareLeftRef.current, compareRightRef.current].filter((el) => el)
      : elementRefs.current.slice(0, currentLayout.total);

    elements.forEach((element) => {
      if (element) {
        try {
          cornerstone.reset(element);
        } catch (err) {
          console.error("Error resetting viewport:", err);
        }
      }
    });
  };

  const zoomIn = () => {
    const element = compareMode
      ? compareLeftRef.current
      : elementRefs.current[activeViewport];
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
    const element = compareMode
      ? compareLeftRef.current
      : elementRefs.current[activeViewport];
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
    const elements = compareMode
      ? [compareLeftRef.current, compareRightRef.current].filter((el) => el)
      : [elementRefs.current[activeViewport]].filter((el) => el);

    elements.forEach((element) => {
      if (element) {
        try {
          cornerstone.fitToWindow(element);
        } catch (err) {
          console.error("Error fitting to window:", err);
        }
      }
    });
  };

  const invertImage = () => {
    const element = compareMode
      ? compareLeftRef.current
      : elementRefs.current[activeViewport];
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
    const element = compareMode
      ? compareLeftRef.current
      : elementRefs.current[activeViewport];
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
    const element = compareMode
      ? compareLeftRef.current
      : elementRefs.current[activeViewport];
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
    const element = compareMode
      ? compareLeftRef.current
      : elementRefs.current[activeViewport];
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
    const elements = compareMode
      ? [compareLeftRef.current, compareRightRef.current].filter((el) => el)
      : elementRefs.current.slice(0, currentLayout.total);

    elements.forEach((element) => {
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
    });
  };

  const clearAnnotations = () => {
    const elements = compareMode
      ? [compareLeftRef.current, compareRightRef.current].filter((el) => el)
      : elementRefs.current.slice(0, currentLayout.total);

    elements.forEach((element) => {
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
    });
  };

  const exportImage = () => {
    const element = compareMode
      ? compareLeftRef.current
      : elementRefs.current[activeViewport];
    if (element) {
      try {
        const canvas = element.querySelector("canvas") as HTMLCanvasElement;
        if (canvas) {
          const currentImage = compareMode
            ? compareImages.left
            : seriesImages[currentSeriesIndex];
          const link = document.createElement("a");
          link.download = `dicom-export-${
            currentImage?.fileName || "image"
          }-${Date.now()}.png`;
          link.href = canvas.toDataURL();
          link.click();
        }
      } catch (err) {
        console.error("Error exporting image:", err);
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
    if (compareMode) return; // Disable layout change in compare mode

    cleanupViewports();
    setCurrentLayout(layout);
    setActiveViewport(0);
    stopCine();
    stopAutoPlay();

    setTimeout(() => {
      displayCurrentImage();
    }, 100);
  };

  const toggleReferenceLines = () => {
    setShowReferenceLines(!showReferenceLines);
    const elements = compareMode
      ? [compareLeftRef.current, compareRightRef.current].filter((el) => el)
      : elementRefs.current.slice(0, currentLayout.total);

    elements.forEach((element) => {
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
    });
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

  const handleTextSubmit = () => {
    if (textAnnotation.trim()) {
      handleToolChange("TextMarker");
      setShowTextModal(false);
      setTextAnnotation("");
    }
  };

  if (!initialized) {
    return (
      <div className="dicom-viewer-container">
        <div className="dicom-loading">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">🔧 Initializing DICOM tools...</p>
        </div>
      </div>
    );
  }

  const viewerContainerStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${currentLayout.cols}, 1fr)`,
    gridTemplateRows: `repeat(${currentLayout.rows}, 1fr)`,
    gap: "2px",
    height: "650px",
    width: "100%",
  };

  const compareContainerStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr",
    gap: "2px",
    height: "650px",
    width: "100%",
  };

  const currentImage = seriesImages[currentSeriesIndex];

  return (
    <div className="dicom-viewer-container">
      <div className="d-flex align-items-center gap-2 mb-3">
        {(loading || seriesLoading) && (
          <small className="text-muted">Loading...</small>
        )}
        {error && <small className="text-danger ms-2">{error}</small>}
        {onBack && (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onBack}
            style={{
              backgroundColor: "#004e64",
              borderColor: "#004e64",
              color: "white",
            }}
          >
            ← Back
          </Button>
        )}

        {/* Compare Mode Button */}
        {seriesImages.length > 1 && (
          <Button
            size="sm"
            onClick={toggleCompareMode}
            style={{
              color: "white",
            }}
          >
            {compareMode ? "Exit Compare" : "🔍 Compare"}
          </Button>
        )}

        {compareMode && (
          <Button size="sm" onClick={clearCompare}>
            Clear
          </Button>
        )}

        {compareMode && (
          <small className="text-info">
            Selected: {compareSelection.length}/2 images
          </small>
        )}
      </div>

      {seriesLoading && (
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span style={{ color: "white" }}>Loading DICOM Series...</span>
            <Badge style={{ backgroundColor: "#004e64", color: "white" }}>
              {Math.round(loadingProgress)}%
            </Badge>
          </div>
          <ProgressBar
            now={loadingProgress}
            style={{
              height: "8px",
              backgroundColor: "#e1e8ed",
            }}
          >
            <ProgressBar
              now={loadingProgress}
              style={{ backgroundColor: "#004e64" }}
            />
          </ProgressBar>
        </div>
      )}

      <div className="dicom-toolbar">
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
                  style={
                    activeTool === "Wwwc"
                      ? { backgroundColor: "#004e64", borderColor: "#004e64" }
                      : { borderColor: "#004e64", color: "#004e64" }
                  }
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
                  style={
                    activeTool === "Pan"
                      ? { backgroundColor: "#004e64", borderColor: "#004e64" }
                      : { borderColor: "#004e64", color: "#004e64" }
                  }
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
                  style={
                    activeTool === "Zoom"
                      ? { backgroundColor: "#004e64", borderColor: "#004e64" }
                      : { borderColor: "#004e64", color: "#004e64" }
                  }
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
                  style={
                    activeTool === "Magnify"
                      ? { backgroundColor: "#004e64", borderColor: "#004e64" }
                      : { borderColor: "#004e64", color: "#004e64" }
                  }
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
                <Dropdown.Toggle
                  variant="outline-secondary"
                  size="sm"
                  disabled={compareMode}
                >
                  🏗️ Layout
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {viewportLayouts.map((layout, idx) => (
                    <Dropdown.Item
                      key={idx}
                      onClick={() => changeLayout(layout)}
                    >
                      {layout.rows}×{layout.cols}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="outline-info" size="sm">
                  🧭 {selectedOrientation}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {orientationPresets.map((orientation, idx) => (
                    <Dropdown.Item
                      key={idx}
                      onClick={() => applyOrientation(orientation)}
                    >
                      {orientation.name}
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
                  style={
                    syncEnabled
                      ? {
                          backgroundColor: "#004e64",
                          borderColor: "#004e64",
                          color: "white",
                        }
                      : {}
                  }
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
                  style={
                    showReferenceLines
                      ? {
                          backgroundColor: "#004e64",
                          borderColor: "#004e64",
                          color: "white",
                        }
                      : {}
                  }
                >
                  ➕ Ref
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
                  <Dropdown.Item onClick={() => setShowTextModal(true)}>
                    📝 Text
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2 justify-content-end flex-wrap">
              {totalFrames > 1 && (
                <ButtonGroup>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Previous Frame</Tooltip>}
                  >
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={previousFrame}
                    >
                      ⬇️
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Next Frame</Tooltip>}
                  >
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={nextFrame}
                    >
                      ⬆️
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Play/Pause Cine</Tooltip>}
                  >
                    <Button
                      variant={cineEnabled ? "success" : "outline-secondary"}
                      size="sm"
                      onClick={toggleCine}
                      style={
                        cineEnabled
                          ? {
                              backgroundColor: "#004e64",
                              borderColor: "#004e64",
                              color: "white",
                            }
                          : {}
                      }
                    >
                      {cineEnabled ? "⏸️" : "▶️"}
                    </Button>
                  </OverlayTrigger>
                </ButtonGroup>
              )}

              <ButtonGroup>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Export Image</Tooltip>}
                >
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={exportImage}
                  >
                    💾 Export
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
                    style={
                      showHistogram
                        ? {
                            backgroundColor: "#004e64",
                            borderColor: "#004e64",
                            color: "white",
                          }
                        : {}
                    }
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
                    🔄 Reset
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
          <Row className="g-0">
            <Col
              style={{
                flex: seriesImages.length > 1 ? "1 1 80%" : "1 1 100%",
                minWidth: 0,
              }}
            >
              <div style={{ position: "relative" }}>
                {compareMode ? (
                  /* Compare Mode Layout */
                  <div
                    style={compareContainerStyle}
                    className="dicom-viewer-grid"
                  >
                    <div
                      ref={compareLeftRef}
                      className="dicom-viewport active"
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "2px solid #004e64",
                        borderRadius: "4px",
                        position: "relative",
                      }}
                    >
                      {compareImages.left && (
                        <div
                          style={{
                            position: "absolute",
                            top: "5px",
                            left: "5px",
                            background: "#004e64",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "3px",
                            fontSize: "12px",
                            zIndex: 10,
                          }}
                        >
                          {compareImages.left.fileName}
                        </div>
                      )}
                    </div>
                    <div
                      ref={compareRightRef}
                      className="dicom-viewport inactive"
                      style={{
                        width: "100%",
                        height: "100%",
                        border: compareImages.right
                          ? "2px solid #004e64"
                          : "2px dashed #ccc",
                        borderRadius: "4px",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {compareImages.right ? (
                        <div
                          style={{
                            position: "absolute",
                            top: "5px",
                            left: "5px",
                            background: "#004e64",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "3px",
                            fontSize: "12px",
                            zIndex: 10,
                          }}
                        >
                          {compareImages.right.fileName}
                        </div>
                      ) : (
                        <div style={{ color: "#666", fontSize: "16px" }}>
                          Select second image to compare
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Normal Mode Layout */
                  <div
                    style={viewerContainerStyle}
                    className="dicom-viewer-grid"
                  >
                    {Array.from({ length: currentLayout.total }).map(
                      (_, index) => (
                        <div
                          key={index}
                          ref={(el) => (elementRefs.current[index] = el)}
                          className={`dicom-viewport ${
                            index === activeViewport ? "active" : "inactive"
                          }`}
                          style={{
                            width: "100%",
                            height: "100%",
                            cursor: activeTool === "Pan" ? "grab" : "crosshair",
                            position: "relative",
                          }}
                          onClick={() => setActiveViewport(index)}
                        />
                      )
                    )}
                  </div>
                )}

                <div className="dicom-overlay" style={{ top: 10, left: 10 }}>
                  <div>
                    👤 Patient: {tags?.["0010,0010"]?.Value?.[0] || "Unknown"}
                  </div>
                  <div>
                    📚 Study: {tags?.["0020,0010"]?.Value?.[0] || "N/A"}
                  </div>
                  <div>
                    🏥 Modality: {tags?.["0008,0060"]?.Value?.[0] || "N/A"}
                  </div>
                  {!compareMode && (
                    <div>
                      🖼️ Viewport: {activeViewport + 1}/{currentLayout.total}
                    </div>
                  )}
                  {seriesImages.length > 1 && !compareMode && (
                    <div>
                      📁 Series: {currentSeriesIndex + 1}/{seriesImages.length}
                    </div>
                  )}
                  {compareMode && (
                    <div>
                      🔍 Compare Mode: {compareSelection.length}/2 selected
                    </div>
                  )}
                </div>

                <div className="dicom-overlay" style={{ top: 10, right: 10 }}>
                  <div>🔍 Zoom: {viewport?.scale?.toFixed(2) ?? "1.00"}x</div>
                  <div>
                    🪟 WW: {viewport?.voi?.windowWidth?.toFixed(0) ?? "N/A"}
                  </div>
                  <div>
                    🎯 WC: {viewport?.voi?.windowCenter?.toFixed(0) ?? "N/A"}
                  </div>
                  <div>🧭 Orient: {selectedOrientation}</div>
                  {totalFrames > 1 && (
                    <div>
                      🎬 Frame: {currentFrame + 1}/{totalFrames}
                    </div>
                  )}
                </div>

                <div className="dicom-overlay" style={{ bottom: 10, left: 10 }}>
                  <div>📍 X: {mousePosition.x}</div>
                  <div>📍 Y: {mousePosition.y}</div>
                  {mousePosition.pixelValue !== undefined && (
                    <div>🩻 HU: {mousePosition.pixelValue}</div>
                  )}
                  <div>🎯 Tool: {activeTool}</div>
                </div>

                <div
                  className="dicom-overlay"
                  style={{ bottom: 10, right: 10 }}
                >
                  {imageInfo && (
                    <>
                      <div>
                        📐 {imageInfo.width} × {imageInfo.height}
                      </div>
                      <div>
                        🔢 Bits:{" "}
                        {imageInfo.color ? "RGB" : imageInfo.slope || 1}
                      </div>
                      <div>📁 {currentImage?.fileName}</div>
                    </>
                  )}
                  {selectedOrientation === "Axial" && (
                    <div style={{ fontSize: "10px", marginTop: "4px" }}>
                      <div>↔️ Left ← X → Right</div>
                      <div>↕️ Anterior ← Y → Posterior</div>
                    </div>
                  )}
                </div>

                {(loading || seriesLoading) && (
                  <div className="dicom-loading">
                    <div
                      className="spinner-border text-light mb-3"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ color: "white" }} className="mb-0">
                      📥 Loading DICOM {seriesLoading ? "Series" : "Image"}...
                    </p>
                  </div>
                )}

                {error && <div className="dicom-error">❌ {error}</div>}
              </div>
            </Col>

            {seriesImages.length > 1 && (
              <Col
                style={{
                  flex: "0 0 20%",
                  maxWidth: "300px",
                }}
              >
                <div
                  className="h-100 d-flex flex-column"
                  style={{ padding: "0 1rem" }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">
                      {compareMode
                        ? "🔍 Compare Selection"
                        : "📁 Series Navigator"}
                    </h6>
                    <Badge
                      bg="none"
                      style={{ backgroundColor: "#004e64", color: "white" }}
                    >
                      {compareMode
                        ? `${compareSelection.length}/2`
                        : `${currentSeriesIndex + 1}/${seriesImages.length}`}
                    </Badge>
                  </div>

                  {!compareMode && (
                    <div className="d-flex gap-1 mb-3">
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Previous Series</Tooltip>}
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={previousSeries}
                          disabled={seriesImages.length <= 1}
                          style={{ borderColor: "#004e64", color: "#004e64" }}
                        >
                          <FaArrowLeft />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Next Series</Tooltip>}
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={nextSeries}
                          disabled={seriesImages.length <= 1}
                          style={{ borderColor: "#004e64", color: "#004e64" }}
                        >
                          <FaArrowRight />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Auto Play Series</Tooltip>}
                      >
                        <Button
                          variant={autoPlay ? "success" : "outline-secondary"}
                          size="sm"
                          onClick={toggleAutoPlay}
                          disabled={seriesImages.length <= 1}
                          style={
                            autoPlay
                              ? {
                                  backgroundColor: "#004e64",
                                  borderColor: "#004e64",
                                  color: "white",
                                }
                              : {}
                          }
                        >
                          {autoPlay ? <FaPause /> : <FaPlay />}
                        </Button>
                      </OverlayTrigger>
                    </div>
                  )}

                  <div className="flex-grow-1 position-relative">
                    <div
                      className="position-absolute w-100 h-100"
                      style={{
                        maxHeight: "500px",
                        overflowY: "auto",
                        paddingRight: "8px",
                      }}
                    >
                      <ListGroup variant="flush">
                        {seriesImages.map((image, index) => {
                          const isSelected = compareMode
                            ? compareSelection.includes(image.id)
                            : index === currentSeriesIndex;

                          return (
                            <ListGroup.Item
                              key={image.id}
                              active={isSelected}
                              action
                              onClick={() => goToSeries(index)}
                              className="d-flex flex-column align-items-start px-2 py-2"
                              style={{
                                fontSize: "0.85rem",
                                cursor: "pointer",
                                border: isSelected
                                  ? `2px solid ${
                                      compareMode ? "#004e64" : "#004e64"
                                    }`
                                  : "1px solid var(--color-border)",
                                backgroundColor: isSelected ? "white" : "white",
                                color: isSelected ? "black" : "black",
                              }}
                            >
                              <div className="d-flex justify-content-between w-100">
                                <strong>#{index + 1}</strong>
                                <Badge
                                  bg="none"
                                  style={{
                                    backgroundColor: isSelected
                                      ? "white"
                                      : compareMode
                                      ? "#004e64"
                                      : "#004e64",
                                    color: isSelected
                                      ? compareMode
                                        ? "#004e64"
                                        : "#004e64"
                                      : "white",
                                  }}
                                  className="ms-1"
                                >
                                  {compareMode
                                    ? isSelected
                                      ? "Selected"
                                      : "Select"
                                    : isSelected
                                    ? "Active"
                                    : "Load"}
                                </Badge>
                              </div>
                              <small
                                className="text-truncate w-100"
                                style={{
                                  color: isSelected ? "black" : "#666",
                                }}
                              >
                                {image.fileName}
                              </small>
                            </ListGroup.Item>
                          );
                        })}
                      </ListGroup>
                    </div>
                  </div>

                  {!compareMode && (
                    <div className="mt-3">
                      <div className="mb-2">
                        <small className="text-muted">Quick Navigation:</small>
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max={seriesImages.length - 1}
                          value={currentSeriesIndex}
                          onChange={(e) => goToSeries(parseInt(e.target.value))}
                          disabled={seriesImages.length <= 1}
                          style={{
                            background: `linear-gradient(to right, #004e64 0%, #004e64 ${
                              ((currentSeriesIndex + 1) / seriesImages.length) *
                              100
                            }%, #e1e8ed ${
                              ((currentSeriesIndex + 1) / seriesImages.length) *
                              100
                            }%, #e1e8ed 100%)`,
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <small className="text-muted">
                          Use ←/→ keys or slider to navigate
                        </small>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            )}
          </Row>

          <div className="mt-3">
            <Row>
              <Col md={showHistogram ? 6 : 8}>
                <div className="shortcuts-info">
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
                    <strong>↑↓:</strong> Navigate frames • <strong>←→:</strong>{" "}
                    Navigate series
                  </small>
                </div>
              </Col>
              {showHistogram && (
                <Col md={6}>
                  <h6>📊 Histogram</h6>
                  <div className="histogram-container">
                    {histogramData.slice(0, 50).map((value, index) => (
                      <div
                        key={index}
                        className="histogram-bar"
                        style={{
                          width: "2px",
                          height: `${
                            (value / Math.max(...histogramData)) * 90
                          }px`,
                          backgroundColor: "#004e64",
                        }}
                      />
                    ))}
                  </div>
                </Col>
              )}
              <Col md={showHistogram ? 12 : 4}>
                {viewport && (
                  <div className="viewport-info text-end">
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
                    <small className="text-muted d-block">
                      Orientation: {selectedOrientation}
                    </small>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Tab>

        <Tab eventKey="tags" title="🏷️ DICOM Tags">
          <div className="tags-container">
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
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#004e64", color: "white" }}
        >
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
          <Button
            onClick={handleTextSubmit}
            style={{
              backgroundColor: "#004e64",
              borderColor: "#004e64",
              color: "white",
            }}
          >
            Add Text
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MainDicomViewer;
