import jsQR from 'jsqr';
import CryptoJS from 'crypto-js';

export interface QRCodeData {
  data: string;
  location: {
    topLeftCorner: { x: number; y: number };
    topRightCorner: { x: number; y: number };
    bottomLeftCorner: { x: number; y: number };
    bottomRightCorner: { x: number; y: number };
  };
  timestamp: number;
}

export interface QRSecurityAnalysis {
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  threats: string[];
  dataType: 'url' | 'upi' | 'wifi' | 'contact' | 'email' | 'phone' | 'text' | 'unknown';
  isPhishing: boolean;
  isMalicious: boolean;
  hasRedirect: boolean;
  domainReputation?: 'good' | 'suspicious' | 'malicious' | 'unknown';
  analysis: {
    urlAnalysis?: URLAnalysis;
    upiAnalysis?: UPIAnalysis;
    wifiAnalysis?: WiFiAnalysis;
    contactAnalysis?: ContactAnalysis;
  };
}

export interface URLAnalysis {
  domain: string;
  protocol: string;
  hasSubdomains: boolean;
  suspiciousPatterns: string[];
  isShortened: boolean;
  redirectChain?: string[];
  reputation: 'good' | 'suspicious' | 'malicious' | 'unknown';
}

export interface UPIAnalysis {
  payeeVPA: string;
  payeeName?: string;
  amount?: number;
  currency?: string;
  note?: string;
  isValidVPA: boolean;
  suspiciousPatterns: string[];
}

export interface WiFiAnalysis {
  ssid: string;
  security: string;
  password?: string;
  hidden: boolean;
  suspiciousPatterns: string[];
}

export interface ContactAnalysis {
  name?: string;
  phone?: string;
  email?: string;
  organization?: string;
  suspiciousPatterns: string[];
}

export class QRCodeService {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private detectionCallbacks: ((qrData: QRCodeData, analysis: QRSecurityAnalysis) => void)[] = [];
  private knownMaliciousDomains: Set<string> = new Set();
  private knownPhishingPatterns: RegExp[] = [];

  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
    this.initializeSecurityDatabase();
  }

  private initializeSecurityDatabase() {
    // Known malicious domains (in real implementation, this would come from a threat intelligence API)
    this.knownMaliciousDomains = new Set([
      'malicious-site.com',
      'phishing-bank.net',
      'fake-payment.org',
      'scam-upi.in',
      'fraudulent-qr.com'
    ]);

    // Phishing patterns
    this.knownPhishingPatterns = [
      /paypal\.com-[a-z0-9]+\.com/i,
      /amazon\.com-[a-z0-9]+\.net/i,
      /google\.com-[a-z0-9]+\.org/i,
      /facebook\.com-[a-z0-9]+\.info/i,
      /instagram\.com-[a-z0-9]+\.biz/i,
      /whatsapp\.com-[a-z0-9]+\.co/i,
      /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/,
      /bit\.ly\/[a-zA-Z0-9]+/,
      /tinyurl\.com\/[a-zA-Z0-9]+/,
      /t\.co\/[a-zA-Z0-9]+/
    ];
  }

  async scanFromVideo(video: HTMLVideoElement): Promise<QRCodeData | null> {
    if (!video.videoWidth || !video.videoHeight) {
      return null;
    }

    // Set canvas size to match video
    this.canvas.width = video.videoWidth;
    this.canvas.height = video.videoHeight;

    // Draw video frame to canvas
    this.context.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);

    // Get image data
    const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

    // Scan for QR code
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (qrCode) {
      const qrData: QRCodeData = {
        data: qrCode.data,
        location: qrCode.location,
        timestamp: Date.now()
      };

      // Perform security analysis
      const analysis = await this.analyzeQRSecurity(qrData);

      // Notify callbacks
      this.detectionCallbacks.forEach(callback => {
        try {
          callback(qrData, analysis);
        } catch (error) {
          console.error('QR detection callback error:', error);
        }
      });

      return qrData;
    }

    return null;
  }

  async scanFromImage(imageElement: HTMLImageElement): Promise<QRCodeData | null> {
    this.canvas.width = imageElement.naturalWidth;
    this.canvas.height = imageElement.naturalHeight;

    this.context.drawImage(imageElement, 0, 0);
    const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

    if (qrCode) {
      const qrData: QRCodeData = {
        data: qrCode.data,
        location: qrCode.location,
        timestamp: Date.now()
      };

      const analysis = await this.analyzeQRSecurity(qrData);
      return qrData;
    }

    return null;
  }

  async analyzeQRSecurity(qrData: QRCodeData): Promise<QRSecurityAnalysis> {
    const data = qrData.data;
    let riskScore = 0;
    const threats: string[] = [];
    let isPhishing = false;
    let isMalicious = false;
    let hasRedirect = false;
    let domainReputation: 'good' | 'suspicious' | 'malicious' | 'unknown' = 'unknown';

    // Determine data type
    const dataType = this.determineDataType(data);

    // Initialize analysis object
    const analysis: QRSecurityAnalysis['analysis'] = {};

    // Perform type-specific analysis
    switch (dataType) {
      case 'url':
        analysis.urlAnalysis = await this.analyzeURL(data);
        riskScore += this.calculateURLRisk(analysis.urlAnalysis);
        isPhishing = analysis.urlAnalysis.reputation === 'malicious' || 
                    analysis.urlAnalysis.suspiciousPatterns.length > 0;
        isMalicious = analysis.urlAnalysis.reputation === 'malicious';
        hasRedirect = analysis.urlAnalysis.isShortened;
        domainReputation = analysis.urlAnalysis.reputation;
        threats.push(...analysis.urlAnalysis.suspiciousPatterns);
        break;

      case 'upi':
        analysis.upiAnalysis = this.analyzeUPI(data);
        riskScore += this.calculateUPIRisk(analysis.upiAnalysis);
        threats.push(...analysis.upiAnalysis.suspiciousPatterns);
        break;

      case 'wifi':
        analysis.wifiAnalysis = this.analyzeWiFi(data);
        riskScore += this.calculateWiFiRisk(analysis.wifiAnalysis);
        threats.push(...analysis.wifiAnalysis.suspiciousPatterns);
        break;

      case 'contact':
        analysis.contactAnalysis = this.analyzeContact(data);
        riskScore += this.calculateContactRisk(analysis.contactAnalysis);
        threats.push(...analysis.contactAnalysis.suspiciousPatterns);
        break;

      default:
        // Generic text analysis
        riskScore += this.analyzeGenericText(data);
        break;
    }

    // Additional security checks
    if (this.containsSuspiciousKeywords(data)) {
      riskScore += 20;
      threats.push('Contains suspicious keywords');
    }

    if (this.hasObfuscatedContent(data)) {
      riskScore += 15;
      threats.push('Contains obfuscated content');
    }

    // Determine risk level
    let riskLevel: QRSecurityAnalysis['riskLevel'];
    if (riskScore < 20) riskLevel = 'safe';
    else if (riskScore < 40) riskLevel = 'low';
    else if (riskScore < 60) riskLevel = 'medium';
    else if (riskScore < 80) riskLevel = 'high';
    else riskLevel = 'critical';

    return {
      riskLevel,
      riskScore: Math.min(100, riskScore),
      threats,
      dataType,
      isPhishing,
      isMalicious,
      hasRedirect,
      domainReputation,
      analysis
    };
  }

  private determineDataType(data: string): QRSecurityAnalysis['dataType'] {
    if (data.match(/^https?:\/\//i)) return 'url';
    if (data.match(/^upi:\/\//i)) return 'upi';
    if (data.match(/^WIFI:/i)) return 'wifi';
    if (data.match(/^BEGIN:VCARD/i)) return 'contact';
    if (data.match(/^mailto:/i)) return 'email';
    if (data.match(/^tel:/i)) return 'phone';
    return 'text';
  }

  private async analyzeURL(url: string): Promise<URLAnalysis> {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const protocol = urlObj.protocol;
      const hasSubdomains = domain.split('.').length > 2;
      const suspiciousPatterns: string[] = [];

      // Check against known malicious domains
      let reputation: URLAnalysis['reputation'] = 'unknown';
      if (this.knownMaliciousDomains.has(domain)) {
        reputation = 'malicious';
        suspiciousPatterns.push('Known malicious domain');
      }

      // Check for phishing patterns
      for (const pattern of this.knownPhishingPatterns) {
        if (pattern.test(url)) {
          suspiciousPatterns.push(`Matches phishing pattern: ${pattern.source}`);
          reputation = 'suspicious';
        }
      }

      // Check for suspicious URL characteristics
      if (domain.includes('xn--')) {
        suspiciousPatterns.push('Punycode domain (potential homograph attack)');
      }

      if (urlObj.pathname.includes('..')) {
        suspiciousPatterns.push('Path traversal attempt');
      }

      if (url.length > 200) {
        suspiciousPatterns.push('Unusually long URL');
      }

      // Check for URL shorteners
      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly'];
      const isShortened = shorteners.some(shortener => domain.includes(shortener));

      // In a real implementation, you would check domain reputation via API
      if (reputation === 'unknown' && suspiciousPatterns.length === 0) {
        reputation = 'good';
      }

      return {
        domain,
        protocol,
        hasSubdomains,
        suspiciousPatterns,
        isShortened,
        reputation
      };
    } catch (error) {
      return {
        domain: 'invalid',
        protocol: 'unknown',
        hasSubdomains: false,
        suspiciousPatterns: ['Invalid URL format'],
        isShortened: false,
        reputation: 'malicious'
      };
    }
  }

  private analyzeUPI(upiString: string): UPIAnalysis {
    const suspiciousPatterns: string[] = [];
    
    try {
      // Parse UPI string: upi://pay?pa=example@bank&pn=Name&am=100&cu=INR&tn=Note
      const url = new URL(upiString);
      const params = url.searchParams;
      
      const payeeVPA = params.get('pa') || '';
      const payeeName = params.get('pn') || undefined;
      const amount = params.get('am') ? parseFloat(params.get('am')!) : undefined;
      const currency = params.get('cu') || undefined;
      const note = params.get('tn') || undefined;

      // Validate VPA format
      const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
      const isValidVPA = vpaRegex.test(payeeVPA);

      if (!isValidVPA) {
        suspiciousPatterns.push('Invalid VPA format');
      }

      // Check for suspicious amounts
      if (amount && amount > 100000) {
        suspiciousPatterns.push('High transaction amount');
      }

      // Check for suspicious VPA patterns
      if (payeeVPA.includes('test') || payeeVPA.includes('fake')) {
        suspiciousPatterns.push('Suspicious VPA keywords');
      }

      // Check for suspicious notes
      if (note && (note.toLowerCase().includes('urgent') || note.toLowerCase().includes('emergency'))) {
        suspiciousPatterns.push('Urgent/emergency payment request');
      }

      return {
        payeeVPA,
        payeeName,
        amount,
        currency,
        note,
        isValidVPA,
        suspiciousPatterns
      };
    } catch (error) {
      return {
        payeeVPA: '',
        isValidVPA: false,
        suspiciousPatterns: ['Invalid UPI format']
      };
    }
  }

  private analyzeWiFi(wifiString: string): WiFiAnalysis {
    const suspiciousPatterns: string[] = [];
    
    try {
      // Parse WiFi string: WIFI:T:WPA;S:NetworkName;P:password;H:false;;
      const parts = wifiString.split(';');
      let ssid = '';
      let security = '';
      let password = '';
      let hidden = false;

      for (const part of parts) {
        if (part.startsWith('S:')) ssid = part.substring(2);
        if (part.startsWith('T:')) security = part.substring(2);
        if (part.startsWith('P:')) password = part.substring(2);
        if (part.startsWith('H:')) hidden = part.substring(2) === 'true';
      }

      // Check for suspicious SSID patterns
      const suspiciousSSIDs = ['free wifi', 'public', 'guest', 'open', 'hack'];
      if (suspiciousSSIDs.some(sus => ssid.toLowerCase().includes(sus))) {
        suspiciousPatterns.push('Suspicious SSID name');
      }

      // Check for weak security
      if (security === 'nopass' || security === 'WEP') {
        suspiciousPatterns.push('Weak or no security');
      }

      // Check for hidden networks
      if (hidden) {
        suspiciousPatterns.push('Hidden network');
      }

      return {
        ssid,
        security,
        password,
        hidden,
        suspiciousPatterns
      };
    } catch (error) {
      return {
        ssid: '',
        security: '',
        hidden: false,
        suspiciousPatterns: ['Invalid WiFi format']
      };
    }
  }

  private analyzeContact(contactString: string): ContactAnalysis {
    const suspiciousPatterns: string[] = [];
    
    // Basic vCard parsing
    const lines = contactString.split('\n');
    let name = '';
    let phone = '';
    let email = '';
    let organization = '';

    for (const line of lines) {
      if (line.startsWith('FN:')) name = line.substring(3);
      if (line.startsWith('TEL:')) phone = line.substring(4);
      if (line.startsWith('EMAIL:')) email = line.substring(6);
      if (line.startsWith('ORG:')) organization = line.substring(4);
    }

    // Check for suspicious patterns
    if (email && !email.includes('@')) {
      suspiciousPatterns.push('Invalid email format');
    }

    if (phone && !/^\+?[\d\s\-\(\)]+$/.test(phone)) {
      suspiciousPatterns.push('Invalid phone format');
    }

    return {
      name,
      phone,
      email,
      organization,
      suspiciousPatterns
    };
  }

  private calculateURLRisk(analysis: URLAnalysis): number {
    let risk = 0;
    
    if (analysis.reputation === 'malicious') risk += 50;
    else if (analysis.reputation === 'suspicious') risk += 30;
    
    risk += analysis.suspiciousPatterns.length * 10;
    
    if (analysis.isShortened) risk += 15;
    if (analysis.protocol !== 'https:') risk += 10;
    
    return risk;
  }

  private calculateUPIRisk(analysis: UPIAnalysis): number {
    let risk = 0;
    
    if (!analysis.isValidVPA) risk += 40;
    risk += analysis.suspiciousPatterns.length * 15;
    
    if (analysis.amount && analysis.amount > 50000) risk += 20;
    
    return risk;
  }

  private calculateWiFiRisk(analysis: WiFiAnalysis): number {
    let risk = 0;
    
    risk += analysis.suspiciousPatterns.length * 10;
    
    if (analysis.security === 'nopass') risk += 30;
    if (analysis.hidden) risk += 15;
    
    return risk;
  }

  private calculateContactRisk(analysis: ContactAnalysis): number {
    return analysis.suspiciousPatterns.length * 10;
  }

  private analyzeGenericText(text: string): number {
    let risk = 0;
    
    // Check for suspicious keywords
    const suspiciousKeywords = [
      'click here', 'urgent', 'limited time', 'act now', 'free money',
      'congratulations', 'winner', 'prize', 'lottery', 'inheritance'
    ];
    
    for (const keyword of suspiciousKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        risk += 10;
      }
    }
    
    return risk;
  }

  private containsSuspiciousKeywords(data: string): boolean {
    const keywords = [
      'phishing', 'malware', 'virus', 'hack', 'steal', 'fraud',
      'scam', 'fake', 'suspicious', 'dangerous'
    ];
    
    return keywords.some(keyword => 
      data.toLowerCase().includes(keyword)
    );
  }

  private hasObfuscatedContent(data: string): boolean {
    // Check for base64 encoding
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (data.length > 20 && base64Regex.test(data)) {
      return true;
    }
    
    // Check for excessive special characters
    const specialCharCount = (data.match(/[^a-zA-Z0-9\s]/g) || []).length;
    return specialCharCount > data.length * 0.3;
  }

  onQRDetection(callback: (qrData: QRCodeData, analysis: QRSecurityAnalysis) => void): void {
    this.detectionCallbacks.push(callback);
  }

  removeQRDetectionCallback(callback: (qrData: QRCodeData, analysis: QRSecurityAnalysis) => void): void {
    const index = this.detectionCallbacks.indexOf(callback);
    if (index > -1) {
      this.detectionCallbacks.splice(index, 1);
    }
  }

  generateSecureQR(data: string, options?: { encryption?: boolean; signature?: boolean }): string {
    let processedData = data;
    
    if (options?.encryption) {
      // Simple encryption (in production, use proper encryption)
      processedData = CryptoJS.AES.encrypt(data, 'secure-key').toString();
    }
    
    if (options?.signature) {
      // Add digital signature
      const signature = CryptoJS.HmacSHA256(processedData, 'signature-key').toString();
      processedData += `|sig:${signature}`;
    }
    
    return processedData;
  }

  verifySecureQR(qrData: string, options?: { encryption?: boolean; signature?: boolean }): { valid: boolean; data?: string } {
    try {
      let processedData = qrData;
      
      if (options?.signature) {
        const parts = processedData.split('|sig:');
        if (parts.length !== 2) return { valid: false };
        
        const [data, signature] = parts;
        const expectedSignature = CryptoJS.HmacSHA256(data, 'signature-key').toString();
        
        if (signature !== expectedSignature) return { valid: false };
        processedData = data;
      }
      
      if (options?.encryption) {
        const decrypted = CryptoJS.AES.decrypt(processedData, 'secure-key').toString(CryptoJS.enc.Utf8);
        if (!decrypted) return { valid: false };
        processedData = decrypted;
      }
      
      return { valid: true, data: processedData };
    } catch (error) {
      return { valid: false };
    }
  }
}

export const qrCodeService = new QRCodeService();
