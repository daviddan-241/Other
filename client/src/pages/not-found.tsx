import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4 text-primary font-mono">
      <div className="scanline" />
      
      <Card className="w-full max-w-md bg-black border-destructive/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="flex justify-center">
            <AlertTriangle className="h-24 w-24 text-destructive animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black text-destructive tracking-widest">ERROR 404</h1>
            <p className="text-destructive/70 uppercase tracking-wide text-sm">
              Resource Location Not Found
            </p>
          </div>

          <div className="p-4 border border-destructive/20 bg-destructive/5 text-left text-xs font-mono space-y-1 opacity-80">
            <p>{`> locating_resource... FAILED`}</p>
            <p>{`> tracing_route... FAILED`}</p>
            <p>{`> system_integrity... CRITICAL`}</p>
            <p className="animate-pulse">{`> _`}</p>
          </div>

          <Link href="/">
            <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-black mt-4 rounded-none">
              RETURN_TO_ROOT
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
