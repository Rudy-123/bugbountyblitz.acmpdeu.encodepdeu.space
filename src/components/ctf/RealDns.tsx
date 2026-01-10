"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Copy, ExternalLink, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type RealDnsProps = {
  domain: string;
};

export function RealDns({ domain }: RealDnsProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Command copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the command manually",
        variant: "destructive",
      });
    }
  };

  const dnsCommands = [
    {
      tool: "nslookup",
      command: `nslookup -type=TXT ${domain}`,
      description: "Standard DNS lookup tool (Windows/Linux/Mac)"
    },
    {
      tool: "dig", 
      command: `dig TXT ${domain}`,
      description: "More detailed DNS tool (Linux/Mac, or Windows with bind-utils)"
    },
    {
      tool: "host",
      command: `host -t TXT ${domain}`,
      description: "Simple DNS lookup (Linux/Mac)"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            DNS TXT Record Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm mb-2"><strong>Target Domain:</strong></p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-base px-3 py-1">
                {domain}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(domain)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Use any of these commands to query the TXT record:</p>
            
            {dnsCommands.map((cmd, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{cmd.tool}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(cmd.command)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <code className="block bg-background p-2 rounded text-sm font-mono break-all">
                  {cmd.command}
                </code>
                <p className="text-xs text-muted-foreground">{cmd.description}</p>
              </div>
            ))}
          </div>

          <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-4 rounded">
            <h4 className="font-semibold text-sm mb-1">💡 Instructions:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Open your terminal/command prompt</li>
              <li>Run one of the DNS lookup commands above</li>
              <li>Look for TXT records in the response</li>
              <li>The flag will be in one of the TXT records</li>
            </ol>
          </div>

          <div className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded">
            <h4 className="font-semibold text-sm mb-1">⚠️ Note:</h4>
            <p className="text-sm text-muted-foreground">
              This is a <strong>real DNS lookup</strong>. You need to use actual DNS tools from your command line, 
              not this web interface. The flag is stored in the actual DNS TXT record for this domain.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alternative Online Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">
            If you don't have command line access, you can use these online DNS lookup tools:
          </p>
          
          {[
            { name: "MXToolbox", url: `https://mxtoolbox.com/TXTLookup.aspx?domain=${domain}` },
            { name: "DNSChecker", url: `https://dnschecker.org/#TXT/${domain}` },
            { name: "WhatsMyDNS", url: `https://www.whatsmydns.net/#TXT/${domain}` },
          ].map((tool, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">{tool.name}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(tool.url, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}