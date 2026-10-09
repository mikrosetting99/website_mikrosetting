"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyableOutput } from "./copyable-output";

/**
 * Fallback generator for tools without a dedicated UI yet. Produces a real,
 * usable RouterOS script skeleton from the inputs rather than a dead
 * placeholder — admins can still extend specific tools later with
 * their own component (see VpnGenerator / IpCalculator for examples).
 */
export function GenericScriptGenerator({ toolName }: { toolName: string }) {
  const [interfaceName, setInterfaceName] = useState("ether1");
  const [notes, setNotes] = useState("");
  const [script, setScript] = useState<string | null>(null);

  function handleGenerate() {
    const lines = [
      `# ${toolName}`,
      `# Dibuat otomatis oleh Mikrosetting pada ${new Date().toLocaleString("id-ID")}`,
      `:local targetInterface "${interfaceName}"`,
      "/interface print where name=$targetInterface",
      notes ? `# Catatan: ${notes}` : null,
    ].filter(Boolean);
    setScript(lines.join("\n"));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="interfaceName">Nama Interface</Label>
          <Input
            id="interfaceName"
            value={interfaceName}
            onChange={(e) => setInterfaceName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes">Catatan / Parameter Tambahan</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={1} />
        </div>
      </div>

      <Button type="button" onClick={handleGenerate}>
        Generate Script
      </Button>

      {script && <CopyableOutput value={script} label="Script RouterOS" />}
    </div>
  );
}
