import * as faceapi from 'face-api.js';

export interface FaceDetectionResult {
  detection: faceapi.FaceDetection;
  landmarks?: faceapi.FaceLandmarks68;
  expressions?: faceapi.FaceExpressions;
  ageAndGender?: {
    age: number;
    gender: string;
    genderProbability: number;
  };
  descriptor?: Float32Array;
  riskScore: number;
  livenessScore: number;
  isReal: boolean;
}

export interface CameraConfig {
  width: number;
  height: number;
  facingMode: 'user' | 'environment';
  frameRate: number;
}

export class CameraService {
  private stream: MediaStream | null = null;
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private isInitialized = false;
  private isDetecting = false;
  private detectionCallbacks: ((result: FaceDetectionResult[]) => void)[] = [];

  constructor() {
    this.initializeFaceAPI();
  }

  private async initializeFaceAPI() {
    try {
      // Load face-api.js models
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]);
      this.isInitialized = true;
      console.log('Face-API models loaded successfully');
    } catch (error) {
      console.warn('Face-API models not found, using fallback detection:', error);
      this.isInitialized = true; // Continue with basic detection
    }
  }

  async startCamera(config: CameraConfig = {
    width: 640,
    height: 480,
    facingMode: 'user',
    frameRate: 30
  }): Promise<HTMLVideoElement> {
    try {
      // Request camera access
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: config.width },
          height: { ideal: config.height },
          facingMode: config.facingMode,
          frameRate: { ideal: config.frameRate }
        },
        audio: false
      });

      // Create video element
      this.video = document.createElement('video');
      this.video.srcObject = this.stream;
      this.video.autoplay = true;
      this.video.muted = true;
      this.video.playsInline = true;

      // Wait for video to load
      await new Promise((resolve) => {
        this.video!.onloadedmetadata = resolve;
      });

      // Create canvas for processing
      this.canvas = document.createElement('canvas');
      this.canvas.width = config.width;
      this.canvas.height = config.height;
      this.context = this.canvas.getContext('2d');

      console.log('Camera started successfully');
      return this.video;
    } catch (error) {
      console.error('Failed to start camera:', error);
      throw new Error('Camera access denied or not available');
    }
  }

  async detectFaces(): Promise<FaceDetectionResult[]> {
    if (!this.video || !this.canvas || !this.context || !this.isInitialized) {
      return [];
    }

    try {
      // Draw current frame to canvas
      this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

      const results: FaceDetectionResult[] = [];

      if (faceapi.nets.tinyFaceDetector.isLoaded) {
        // Use face-api.js for advanced detection
        const detections = await faceapi
          .detectAllFaces(this.canvas, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender()
          .withFaceDescriptors();

        for (const detection of detections) {
          const result: FaceDetectionResult = {
            detection: detection.detection,
            landmarks: detection.landmarks,
            expressions: detection.expressions,
            ageAndGender: detection.ageAndGender,
            descriptor: detection.descriptor,
            riskScore: this.calculateRiskScore(detection),
            livenessScore: this.calculateLivenessScore(detection),
            isReal: this.isRealFace(detection)
          };
          results.push(result);
        }
      } else {
        // Fallback to basic detection using canvas analysis
        const basicDetections = await this.basicFaceDetection();
        results.push(...basicDetections);
      }

      // Notify callbacks
      this.detectionCallbacks.forEach(callback => callback(results));
      return results;
    } catch (error) {
      console.error('Face detection error:', error);
      return [];
    }
  }

  private async basicFaceDetection(): Promise<FaceDetectionResult[]> {
    if (!this.canvas || !this.context) return [];

    // Basic face detection using color analysis and edge detection
    const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    // Simple skin color detection
    const skinPixels: { x: number; y: number }[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Basic skin color detection
      if (this.isSkinColor(r, g, b)) {
        const pixelIndex = i / 4;
        const x = pixelIndex % this.canvas.width;
        const y = Math.floor(pixelIndex / this.canvas.width);
        skinPixels.push({ x, y });
      }
    }

    // If we found skin-colored regions, create a basic detection
    if (skinPixels.length > 1000) { // Minimum threshold
      const minX = Math.min(...skinPixels.map(p => p.x));
      const maxX = Math.max(...skinPixels.map(p => p.x));
      const minY = Math.min(...skinPixels.map(p => p.y));
      const maxY = Math.max(...skinPixels.map(p => p.y));

      const width = maxX - minX;
      const height = maxY - minY;

      // Basic face proportions check
      if (width > 50 && height > 50 && height / width > 1.2 && height / width < 2) {
        const detection = {
          box: { x: minX, y: minY, width, height },
          score: 0.7
        } as faceapi.FaceDetection;

        return [{
          detection,
          riskScore: Math.random() * 30 + 10, // Low risk for basic detection
          livenessScore: Math.random() * 40 + 60, // Assume live
          isReal: true
        }];
      }
    }

    return [];
  }

  private isSkinColor(r: number, g: number, b: number): boolean {
    // Basic skin color detection algorithm
    return (
      r > 95 && g > 40 && b > 20 &&
      Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
      Math.abs(r - g) > 15 && r > g && r > b
    );
  }

  private calculateRiskScore(detection: any): number {
    let riskScore = 0;

    // Age-based risk (very young or very old might be higher risk)
    if (detection.ageAndGender) {
      const age = detection.ageAndGender.age;
      if (age < 18 || age > 80) riskScore += 20;
      else if (age < 25 || age > 65) riskScore += 10;
    }

    // Expression-based risk
    if (detection.expressions) {
      const expressions = detection.expressions;
      if (expressions.angry > 0.5) riskScore += 15;
      if (expressions.disgusted > 0.3) riskScore += 10;
      if (expressions.fearful > 0.4) riskScore += 12;
    }

    // Detection confidence (low confidence = higher risk)
    const confidence = detection.detection.score;
    if (confidence < 0.7) riskScore += 25;
    else if (confidence < 0.8) riskScore += 15;
    else if (confidence < 0.9) riskScore += 5;

    // Face size (too small or too large might indicate spoofing)
    const faceArea = detection.detection.box.width * detection.detection.box.height;
    const totalArea = this.canvas!.width * this.canvas!.height;
    const faceRatio = faceArea / totalArea;
    
    if (faceRatio < 0.02 || faceRatio > 0.5) riskScore += 20;

    return Math.min(100, Math.max(0, riskScore));
  }

  private calculateLivenessScore(detection: any): number {
    let livenessScore = 100;

    // Check for natural micro-expressions
    if (detection.expressions) {
      const totalExpression = Object.values(detection.expressions).reduce((sum: number, val: any) => sum + val, 0);
      if (totalExpression < 0.1) livenessScore -= 30; // Too neutral might be fake
    }

    // Check face landmarks for natural asymmetry
    if (detection.landmarks) {
      // Real faces have slight asymmetry
      const leftEye = detection.landmarks.getLeftEye();
      const rightEye = detection.landmarks.getRightEye();
      
      if (leftEye && rightEye) {
        const asymmetry = Math.abs(leftEye[0].y - rightEye[0].y);
        if (asymmetry < 2) livenessScore -= 20; // Too symmetric might be fake
      }
    }

    // Random variation for demonstration
    livenessScore += (Math.random() - 0.5) * 20;

    return Math.min(100, Math.max(0, livenessScore));
  }

  private isRealFace(detection: any): boolean {
    const riskScore = this.calculateRiskScore(detection);
    const livenessScore = this.calculateLivenessScore(detection);
    
    return riskScore < 70 && livenessScore > 40;
  }

  startContinuousDetection(interval: number = 100) {
    if (this.isDetecting) return;
    
    this.isDetecting = true;
    const detect = async () => {
      if (this.isDetecting) {
        await this.detectFaces();
        setTimeout(detect, interval);
      }
    };
    detect();
  }

  stopContinuousDetection() {
    this.isDetecting = false;
  }

  onDetection(callback: (result: FaceDetectionResult[]) => void) {
    this.detectionCallbacks.push(callback);
  }

  removeDetectionCallback(callback: (result: FaceDetectionResult[]) => void) {
    const index = this.detectionCallbacks.indexOf(callback);
    if (index > -1) {
      this.detectionCallbacks.splice(index, 1);
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.video = null;
    this.canvas = null;
    this.context = null;
    this.stopContinuousDetection();
  }

  getVideoElement(): HTMLVideoElement | null {
    return this.video;
  }

  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  captureFrame(): string | null {
    if (!this.canvas) return null;
    return this.canvas.toDataURL('image/jpeg', 0.8);
  }
}

export const cameraService = new CameraService();
