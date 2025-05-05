import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { duplicatiReportSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Global API route prefix
  const apiRouter = '/api';
  
  // GET dashboard stats
  app.get(`${apiRouter}/stats`, async (_req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
    }
  });
  
  // GET devices
  app.get(`${apiRouter}/devices`, async (_req, res) => {
    try {
      const devices = await storage.getDevices();
      res.json(devices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).json({ message: 'Failed to fetch devices' });
    }
  });
  
  // GET device by ID
  app.get(`${apiRouter}/devices/:id`, async (req, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: 'Invalid device ID' });
      }
      
      const device = await storage.getDevice(deviceId);
      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }
      
      res.json(device);
    } catch (error) {
      console.error('Error fetching device:', error);
      res.status(500).json({ message: 'Failed to fetch device' });
    }
  });
  
  // GET backup reports with filtering
  app.get(`${apiRouter}/backup-reports`, async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        dateRange: req.query.dateRange as string | undefined,
        deviceType: req.query.deviceType as string | undefined
      };
      
      const reports = await storage.getBackupReports(filters);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching backup reports:', error);
      res.status(500).json({ message: 'Failed to fetch backup reports' });
    }
  });
  
  // GET latest backup report per device
  app.get(`${apiRouter}/latest-backups`, async (_req, res) => {
    try {
      const reports = await storage.getLatestBackupReportPerDevice();
      
      // Enrich with device info
      const enrichedReports = await Promise.all(
        reports.map(async (report) => {
          const device = await storage.getDevice(report.deviceId);
          return {
            ...report,
            device
          };
        })
      );
      
      res.json(enrichedReports);
    } catch (error) {
      console.error('Error fetching latest backups:', error);
      res.status(500).json({ message: 'Failed to fetch latest backups' });
    }
  });
  
  // GET backup reports for a specific device
  app.get(`${apiRouter}/devices/:id/backup-reports`, async (req, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: 'Invalid device ID' });
      }
      
      const device = await storage.getDevice(deviceId);
      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }
      
      const reports = await storage.getBackupReportsByDeviceId(deviceId);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching device backup reports:', error);
      res.status(500).json({ message: 'Failed to fetch device backup reports' });
    }
  });
  
  // POST to receive backup report from Duplicati agents
  app.post(`${apiRouter}/backup/report`, async (req: Request, res: Response) => {
    try {
      const reportData = duplicatiReportSchema.parse(req.body);
      
      const result = await storage.processDuplicatiReport(reportData);
      
      res.status(201).json({
        message: 'Backup report received successfully',
        report: result.report,
        device: result.device,
        alert: result.alert
      });
    } catch (error) {
      console.error('Error processing backup report:', error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: 'Invalid backup report data', 
          errors: validationError.message 
        });
      }
      
      res.status(500).json({ message: 'Failed to process backup report' });
    }
  });
  
  // GET alerts
  app.get(`${apiRouter}/alerts`, async (_req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      res.status(500).json({ message: 'Failed to fetch alerts' });
    }
  });
  
  // GET recent alerts
  app.get(`${apiRouter}/recent-alerts`, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string || '5');
      const alerts = await storage.getRecentAlerts(limit);
      
      // Enrich with device info
      const enrichedAlerts = await Promise.all(
        alerts.map(async (alert) => {
          const device = alert.deviceId ? await storage.getDevice(alert.deviceId) : null;
          return {
            ...alert,
            device
          };
        })
      );
      
      res.json(enrichedAlerts);
    } catch (error) {
      console.error('Error fetching recent alerts:', error);
      res.status(500).json({ message: 'Failed to fetch recent alerts' });
    }
  });
  
  // PATCH to mark alert as read
  app.patch(`${apiRouter}/alerts/:id/read`, async (req, res) => {
    try {
      const alertId = parseInt(req.params.id);
      if (isNaN(alertId)) {
        return res.status(400).json({ message: 'Invalid alert ID' });
      }
      
      const alert = await storage.markAlertAsRead(alertId);
      if (!alert) {
        return res.status(404).json({ message: 'Alert not found' });
      }
      
      res.json(alert);
    } catch (error) {
      console.error('Error marking alert as read:', error);
      res.status(500).json({ message: 'Failed to mark alert as read' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
