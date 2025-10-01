import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import AWS from 'aws-sdk';

export interface UploadOptions {
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  resizeOptions?: {
    width?: number;
    height?: number;
    quality?: number;
  };
  uploadToS3?: boolean;
  s3Bucket?: string;
  s3Folder?: string;
}

export class FileUploadService {
  private s3: AWS.S3;
  private uploadPath: string;

  constructor() {
    // Initialize AWS S3
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    this.uploadPath = process.env.UPLOAD_PATH || 'uploads/';
    
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  /**
   * Configure multer for file uploads
   */
  configureMulter(options: UploadOptions = {}) {
    const {
      maxFileSize = 5 * 1024 * 1024, // 5MB default
      allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    } = options;

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    });

    const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`));
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: maxFileSize,
        files: 10, // Maximum 10 files per request
      },
    });
  }

  /**
   * Process and optimize uploaded image
   */
  async processImage(
    filePath: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'jpeg' | 'png' | 'webp';
    } = {}
  ): Promise<string> {
    const {
      width = 1200,
      height = 1200,
      quality = 85,
      format = 'jpeg',
    } = options;

    const processedPath = filePath.replace(path.extname(filePath), `_processed.${format}`);

    await sharp(filePath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality })
      .toFile(processedPath);

    // Remove original file
    fs.unlinkSync(filePath);

    return processedPath;
  }

  /**
   * Upload file to S3
   */
  async uploadToS3(
    filePath: string,
    options: {
      bucket?: string;
      folder?: string;
      key?: string;
    } = {}
  ): Promise<string> {
    const {
      bucket = process.env.AWS_S3_BUCKET_NAME,
      folder = 'uploads',
      key = path.basename(filePath),
    } = options;

    const fileContent = fs.readFileSync(filePath);
    const s3Key = `${folder}/${key}`;

    const params = {
      Bucket: bucket!,
      Key: s3Key,
      Body: fileContent,
      ContentType: this.getMimeType(filePath),
      ACL: 'public-read',
    };

    const result = await this.s3.upload(params).promise();
    
    // Remove local file after upload
    fs.unlinkSync(filePath);
    
    return result.Location;
  }

  /**
   * Upload multiple files to S3
   */
  async uploadMultipleToS3(
    files: Express.Multer.File[],
    options: {
      bucket?: string;
      folder?: string;
      processImages?: boolean;
    } = {}
  ): Promise<string[]> {
    const {
      bucket = process.env.AWS_S3_BUCKET_NAME,
      folder = 'uploads',
      processImages = true,
    } = options;

    const uploadPromises = files.map(async (file) => {
      let filePath = file.path;

      // Process image if needed
      if (processImages && this.isImage(file.mimetype)) {
        filePath = await this.processImage(filePath);
      }

      // Upload to S3
      const url = await this.uploadToS3(filePath, {
        bucket,
        folder,
        key: path.basename(filePath),
      });

      return url;
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Delete file from S3
   */
  async deleteFromS3(url: string): Promise<boolean> {
    try {
      const urlParts = url.split('/');
      const key = urlParts.slice(3).join('/'); // Remove domain and bucket name

      await this.s3.deleteObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
      }).promise();

      return true;
    } catch (error) {
      console.error('Failed to delete file from S3:', error);
      return false;
    }
  }

  /**
   * Generate signed URL for private file access
   */
  async generateSignedUrl(
    key: string,
    expiresIn: number = 3600,
    bucket?: string
  ): Promise<string> {
    const params = {
      Bucket: bucket || process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Expires: expiresIn,
    };

    return this.s3.getSignedUrl('getObject', params);
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(filePath: string): Promise<{
    size: number;
    mimeType: string;
    dimensions?: { width: number; height: number };
  }> {
    const stats = fs.statSync(filePath);
    const mimeType = this.getMimeType(filePath);

    let dimensions;
    if (this.isImage(mimeType)) {
      const metadata = await sharp(filePath).metadata();
      dimensions = {
        width: metadata.width || 0,
        height: metadata.height || 0,
      };
    }

    return {
      size: stats.size,
      mimeType,
      dimensions,
    };
  }

  /**
   * Validate file size
   */
  validateFileSize(file: Express.Multer.File, maxSize: number): boolean {
    return file.size <= maxSize;
  }

  /**
   * Validate file type
   */
  validateFileType(file: Express.Multer.File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.mimetype);
  }

  /**
   * Clean up temporary files
   */
  cleanupFiles(filePaths: string[]): void {
    filePaths.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Check if file is an image
   */
  private isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  /**
   * Generate unique filename
   */
  generateUniqueFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const uniqueId = uuidv4();
    return `${name}-${uniqueId}${ext}`;
  }

  /**
   * Create directory if it doesn't exist
   */
  ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Get file size in human readable format
   */
  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}
