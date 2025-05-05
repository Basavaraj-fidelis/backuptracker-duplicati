import { 
  users, type User, type InsertUser,
  apiKeys, type ApiKey, type InsertApiKey,
  devices, type Device, type InsertDevice,
  backupReports, type BackupReport, type InsertBackupReport,
  alerts, type Alert, type InsertAlert,
  type DuplicatiReport
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // API key operations
  getApiKeys(): Promise<ApiKey[]>;
  getApiKey(id: number): Promise<ApiKey | undefined>;
  getApiKeyByValue(key: string): Promise<ApiKey | undefined>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  updateApiKey(id: number, updates: Partial<ApiKey>): Promise<ApiKey | undefined>;
  deleteApiKey(id: number): Promise<boolean>;
  validateApiKey(key: string): Promise<boolean>;
  
  // Device operations
  getDevices(): Promise<Device[]>;
  getDevice(id: number): Promise<Device | undefined>;
  getDeviceByHostname(hostname: string): Promise<Device | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  
  // Backup report operations
  getBackupReports(filters?: BackupReportFilters): Promise<BackupReport[]>;
  getLatestBackupReportPerDevice(): Promise<BackupReport[]>;
  getBackupReportsByDeviceId(deviceId: number): Promise<BackupReport[]>;
  createBackupReport(report: InsertBackupReport): Promise<BackupReport>;
  processDuplicatiReport(report: DuplicatiReport): Promise<{report: BackupReport, device: Device, alert?: Alert}>;
  
  // Alert operations
  getAlerts(): Promise<Alert[]>;
  getRecentAlerts(limit: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: number): Promise<Alert | undefined>;
  
  // Statistics operations
  getDashboardStats(): Promise<DashboardStats>;
}

export interface DashboardStats {
  totalDevices: number;
  healthyBackups: number;
  warningBackups: number;
  failedBackups: number;
}

export interface BackupReportFilters {
  status?: string;
  dateRange?: string;
  deviceType?: string;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private apiKeys: Map<number, ApiKey>;
  private devices: Map<number, Device>;
  private backupReports: Map<number, BackupReport>;
  private alerts: Map<number, Alert>;
  private currentUserId: number;
  private currentApiKeyId: number;
  private currentDeviceId: number;
  private currentReportId: number;
  private currentAlertId: number;

  constructor() {
    this.users = new Map();
    this.apiKeys = new Map();
    this.devices = new Map();
    this.backupReports = new Map();
    this.alerts = new Map();
    this.currentUserId = 1;
    this.currentApiKeyId = 1;
    this.currentDeviceId = 1;
    this.currentReportId = 1;
    this.currentAlertId = 1;
    
    // Add admin user
    this.createUser({
      username: 'admin',
      password: 'admin123', // In a real app, this would be properly hashed
      role: 'admin'
    });
    
    // Add some initial data for demo
    this.setupSampleData();
  }
  
  private setupSampleData() {
    // Create some sample devices
    const devices = [
      { hostname: 'PROD-DB-01', ip: '192.168.1.101', deviceType: 'server' },
      { hostname: 'APP-WEB-02', ip: '192.168.1.122', deviceType: 'server' },
      { hostname: 'WORKSTATION-HR5', ip: '192.168.2.45', deviceType: 'workstation' },
      { hostname: 'FILE-SRV-01', ip: '192.168.1.110', deviceType: 'server' }
    ];
    
    devices.forEach(device => this.createDevice(device));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // API key operations
  async getApiKeys(): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values());
  }
  
  async getApiKey(id: number): Promise<ApiKey | undefined> {
    return this.apiKeys.get(id);
  }
  
  async getApiKeyByValue(key: string): Promise<ApiKey | undefined> {
    return Array.from(this.apiKeys.values()).find(
      apiKey => apiKey.key === key
    );
  }
  
  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    const id = this.currentApiKeyId++;
    const apiKey: ApiKey = {
      ...insertApiKey,
      id,
      createdAt: new Date(),
      lastUsed: null
    };
    this.apiKeys.set(id, apiKey);
    return apiKey;
  }
  
  async updateApiKey(id: number, updates: Partial<ApiKey>): Promise<ApiKey | undefined> {
    const apiKey = this.apiKeys.get(id);
    if (!apiKey) {
      return undefined;
    }
    
    const updatedApiKey = { ...apiKey, ...updates };
    this.apiKeys.set(id, updatedApiKey);
    return updatedApiKey;
  }
  
  async deleteApiKey(id: number): Promise<boolean> {
    return this.apiKeys.delete(id);
  }
  
  async validateApiKey(key: string): Promise<boolean> {
    const apiKey = await this.getApiKeyByValue(key);
    
    if (!apiKey || !apiKey.isActive) {
      return false;
    }
    
    // Check if expired
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return false;
    }
    
    // Update last used timestamp
    this.updateApiKey(apiKey.id, { lastUsed: new Date() });
    
    return true;
  }
  
  // Device operations
  async getDevices(): Promise<Device[]> {
    return Array.from(this.devices.values());
  }
  
  async getDevice(id: number): Promise<Device | undefined> {
    return this.devices.get(id);
  }
  
  async getDeviceByHostname(hostname: string): Promise<Device | undefined> {
    return Array.from(this.devices.values()).find(
      device => device.hostname === hostname
    );
  }
  
  async createDevice(insertDevice: InsertDevice): Promise<Device> {
    const id = this.currentDeviceId++;
    const device: Device = { 
      ...insertDevice, 
      id, 
      createdAt: new Date() 
    };
    this.devices.set(id, device);
    return device;
  }
  
  // Backup report operations
  async getBackupReports(filters?: BackupReportFilters): Promise<BackupReport[]> {
    let reports = Array.from(this.backupReports.values());
    
    if (filters) {
      if (filters.status) {
        reports = reports.filter(report => report.status === filters.status);
      }
      
      if (filters.dateRange) {
        const now = new Date();
        let startDate = new Date();
        
        switch (filters.dateRange) {
          case '24h':
            startDate.setHours(now.getHours() - 24);
            break;
          case '3d':
            startDate.setDate(now.getDate() - 3);
            break;
          case '7d':
            startDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(now.getDate() - 30);
            break;
        }
        
        reports = reports.filter(report => report.time >= startDate);
      }
      
      if (filters.deviceType) {
        const deviceIds = Array.from(this.devices.values())
          .filter(device => device.deviceType === filters.deviceType)
          .map(device => device.id);
        
        reports = reports.filter(report => deviceIds.includes(report.deviceId));
      }
    }
    
    // Sort by time, most recent first
    return reports.sort((a, b) => b.time.getTime() - a.time.getTime());
  }
  
  async getLatestBackupReportPerDevice(): Promise<BackupReport[]> {
    const deviceIds = Array.from(this.devices.values()).map(device => device.id);
    
    const latestReports: BackupReport[] = [];
    
    for (const deviceId of deviceIds) {
      const deviceReports = Array.from(this.backupReports.values())
        .filter(report => report.deviceId === deviceId)
        .sort((a, b) => b.time.getTime() - a.time.getTime());
      
      if (deviceReports.length > 0) {
        latestReports.push(deviceReports[0]);
      }
    }
    
    return latestReports;
  }
  
  async getBackupReportsByDeviceId(deviceId: number): Promise<BackupReport[]> {
    return Array.from(this.backupReports.values())
      .filter(report => report.deviceId === deviceId)
      .sort((a, b) => b.time.getTime() - a.time.getTime());
  }
  
  async createBackupReport(insertReport: InsertBackupReport): Promise<BackupReport> {
    const id = this.currentReportId++;
    const report: BackupReport = { ...insertReport, id };
    this.backupReports.set(id, report);
    return report;
  }
  
  async processDuplicatiReport(report: DuplicatiReport): Promise<{report: BackupReport, device: Device, alert?: Alert}> {
    // Find or create the device
    let device = await this.getDeviceByHostname(report.hostname);
    
    if (!device) {
      device = await this.createDevice({
        hostname: report.hostname,
        ip: report.ip || '',
        deviceType: report.deviceType || 'unknown'
      });
    }
    
    // Create backup report
    const backupReport = await this.createBackupReport({
      deviceId: device.id,
      status: report.status,
      time: report.time,
      size: report.size || '',
      sizeBytes: report.sizeBytes || 0,
      duration: report.duration || 0,
      jobName: report.jobName || '',
      errorMessage: report.errorMessage || '',
      fileCount: report.fileCount || 0,
      metadata: report.metadata || {}
    });
    
    // Generate alert if status is warning or failed
    let alert: Alert | undefined;
    if (report.status === 'warning' || report.status === 'failed') {
      alert = await this.createAlert({
        deviceId: device.id,
        title: `Backup ${report.status} for ${device.hostname}`,
        message: report.errorMessage || `Backup completed with ${report.status} status.`,
        severity: report.status === 'failed' ? 'error' : 'warning',
        time: new Date()
      });
    }
    
    return { report: backupReport, device, alert };
  }
  
  // Alert operations
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.time.getTime() - a.time.getTime());
  }
  
  async getRecentAlerts(limit: number): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, limit);
  }
  
  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.currentAlertId++;
    const alert: Alert = { ...insertAlert, id, isRead: false };
    this.alerts.set(id, alert);
    return alert;
  }
  
  async markAlertAsRead(id: number): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (alert) {
      const updatedAlert = { ...alert, isRead: true };
      this.alerts.set(id, updatedAlert);
      return updatedAlert;
    }
    return undefined;
  }
  
  // Statistics operations
  async getDashboardStats(): Promise<DashboardStats> {
    const devices = await this.getDevices();
    const latestReports = await this.getLatestBackupReportPerDevice();
    
    // Count by status
    const healthyBackups = latestReports.filter(report => report.status === 'success').length;
    const warningBackups = latestReports.filter(report => report.status === 'warning').length;
    const failedBackups = latestReports.filter(report => report.status === 'failed').length;
    
    return {
      totalDevices: devices.length,
      healthyBackups,
      warningBackups,
      failedBackups
    };
  }
}

export const storage = new MemStorage();
