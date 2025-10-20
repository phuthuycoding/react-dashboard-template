import { AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getMissingFirebaseKeys } from '@/lib/services/firebase';

export function FirebaseSetupRequired() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const missingKeys = getMissingFirebaseKeys();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const envExample = `# Firebase Configuration
${missingKeys.map((key) => `${key}=your_${key.toLowerCase().replace('vite_firebase_', '')}_here`).join('\n')}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-orange-500" />
            <CardTitle className="text-2xl">Firebase Setup Required</CardTitle>
          </div>
          <CardDescription>
            This template requires Firebase configuration to work properly. Please follow the steps below to get
            started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Missing Configuration</AlertTitle>
            <AlertDescription>
              The following environment variables are not configured:
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                {missingKeys.map((key) => (
                  <li key={key} className="font-mono text-xs">
                    {key}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Setup Steps:</h3>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">Create a Firebase Project</p>
                  <p className="text-sm text-muted-foreground">
                    Go to the Firebase Console and create a new project or use an existing one.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
                      Open Firebase Console
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">Enable Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    In your Firebase project, go to <strong>Authentication</strong> &gt; <strong>Sign-in method</strong>{' '}
                    and enable <strong>Email/Password</strong>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">Get Your Firebase Config</p>
                  <p className="text-sm text-muted-foreground">
                    In Project Settings &gt; General &gt; Your apps, copy your web app's Firebase configuration.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  4
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">Create .env File</p>
                  <p className="text-sm text-muted-foreground">
                    Create a <code className="rounded bg-muted px-1 py-0.5">.env</code> file in your project root with
                    the following content:
                  </p>
                  <div className="relative">
                    <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                      <code>{envExample}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => copyToClipboard(envExample)}
                    >
                      {copiedKey === envExample ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  5
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">Restart Development Server</p>
                  <p className="text-sm text-muted-foreground">
                    After adding your Firebase configuration, restart the development server:
                  </p>
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                    <code>pnpm dev</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <Alert className="border-blue-500/50 bg-blue-500/10">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertTitle>Need Help?</AlertTitle>
            <AlertDescription className="text-sm">
              Check the{' '}
              <a
                href="https://github.com/your-repo/react-dashboard-template"
                className="font-medium underline underline-offset-4 hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                README.md
              </a>{' '}
              file for detailed setup instructions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
