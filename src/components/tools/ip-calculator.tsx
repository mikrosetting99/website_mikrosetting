"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Result {
  network: string;
  broadcast: string;
  netmask: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
}

function ipToInt(ip: number[]) {
  return ((ip[0] << 24) | (ip[1] << 16) | (ip[2] << 8) | ip[3]) >>> 0;
}

function intToIp(int: number) {
  return [24, 16, 8, 0].map((shift) => (int >>> shift) & 255).join(".");
}

function calculate(cidr: string): Result | null {
  const match = cidr.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!match) return null;

  const octets = [1, 2, 3, 4].map((i) => Number(match[i]));
  const prefix = Number(match[5]);
  if (octets.some((o) => o > 255) || prefix > 32) return null;

  const ipInt = ipToInt(octets);
  const maskInt = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;

  const totalHosts = 2 ** (32 - prefix);
  const usableHosts = totalHosts > 2 ? totalHosts - 2 : totalHosts;

  return {
    network: intToIp(networkInt),
    broadcast: intToIp(broadcastInt),
    netmask: intToIp(maskInt),
    firstHost: totalHosts > 2 ? intToIp(networkInt + 1) : intToIp(networkInt),
    lastHost: totalHosts > 2 ? intToIp(broadcastInt - 1) : intToIp(broadcastInt),
    totalHosts,
    usableHosts,
  };
}

export function IpCalculator() {
  const [input, setInput] = useState("192.168.1.0/24");
  const [result, setResult] = useState<Result | null>(() => calculate("192.168.1.0/24"));
  const [error, setError] = useState<string | null>(null);

  function handleCalculate() {
    const calculated = calculate(input);
    if (!calculated) {
      setError("Format tidak valid. Gunakan format CIDR, contoh: 192.168.1.0/24");
      setResult(null);
      return;
    }
    setError(null);
    setResult(calculated);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cidr">Alamat IP / CIDR</Label>
        <div className="flex gap-2">
          <Input
            id="cidr"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="192.168.1.0/24"
          />
          <Button type="button" onClick={handleCalculate}>
            Hitung
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {result && (
        <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/40 p-4 text-sm sm:grid-cols-3">
          <Field label="Network" value={result.network} />
          <Field label="Netmask" value={result.netmask} />
          <Field label="Broadcast" value={result.broadcast} />
          <Field label="Host Awal" value={result.firstHost} />
          <Field label="Host Akhir" value={result.lastHost} />
          <Field label="Total Host Usable" value={result.usableHosts.toLocaleString("id-ID")} />
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-mono font-medium">{value}</p>
    </div>
  );
}
