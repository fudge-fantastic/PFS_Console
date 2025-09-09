import React, { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Mail, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { inquiryService } from '../services/inquiry.service';
import type { EmailTestResponse } from '../types/inquiry';

export default function InquiriesPage() {
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<EmailTestResponse | null>(null);

  const handleTestEmailService = async () => {
    try {
      setIsTestingEmail(true);
      const result = await inquiryService.testEmailService();
      setLastTestResult(result);
      
      if (result.success) {
        toast.success('Email service is working correctly!');
      } else {
        toast.error('Email service test failed');
      }
    } catch (error) {
      console.error('Email test failed:', error);
      toast.error('Email service test failed. Check your configuration.');
      setLastTestResult({
        success: false,
        message: 'Email service test failed',
        data: {
          test_completed: false,
          timestamp: new Date().toISOString(),
        }
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Inquiries</h1>
            <p className="text-muted-foreground">
              Manage customer inquiries and test email services
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Email Service Test */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <TestTube className="h-5 w-5" />
                <CardTitle className="text-xl">Email Service Test</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Test the email service configuration to ensure inquiry notifications are working.
              </CardDescription>
              
              <Button 
                onClick={handleTestEmailService}
                disabled={isTestingEmail}
                className="w-full"
              >
                {isTestingEmail ? (
                  <>
                    <TestTube className="mr-2 h-4 w-4 animate-spin" />
                    Testing Email Service...
                  </>
                ) : (
                  <>
                    <TestTube className="mr-2 h-4 w-4" />
                    Test Email Service
                  </>
                )}
              </Button>

              {lastTestResult && (
                <div className={`p-3 rounded-md border ${
                  lastTestResult.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {lastTestResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      lastTestResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {lastTestResult.message}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${
                    lastTestResult.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Test completed: {new Date(lastTestResult.data.timestamp).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inquiry Information */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <CardTitle className="text-xl">Inquiry System</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Customer inquiries are submitted via the public contact form and automatically generate email notifications.
              </CardDescription>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Endpoint:</span>
                  <Badge variant="secondary" className="font-mono">
                    POST /inquiry/contact
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Authentication:</span>
                  <Badge variant="outline">Not Required</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Notifications:</span>
                  <Badge variant="default">Automatic</Badge>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Inquiry Fields:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• First Name & Last Name (required)</li>
                  <li>• Email Address (required)</li>
                  <li>• Phone Number (optional)</li>
                  <li>• Subject & Message (required)</li>
                  <li>• Newsletter Subscription (optional)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">API Integration</CardTitle>
            <CardDescription>
              How the inquiry system integrates with your API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium">Submission Process:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Customer submits inquiry via public form</li>
                  <li>API validates required fields</li>
                  <li>System generates unique reference ID</li>
                  <li>Admin notification email sent</li>
                  <li>Customer confirmation email sent</li>
                </ol>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Email Configuration:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• SMTP server: Configured via environment</li>
                  <li>• Admin email: Receives all inquiries</li>
                  <li>• Customer email: Receives confirmation</li>
                  <li>• Async processing: Non-blocking delivery</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
