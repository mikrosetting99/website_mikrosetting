"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CopyableOutput } from "./copyable-output";

type Protocol = "l2tp" | "pptp" | "wireguard" | "openvpn";

function buildScript(protocol: Protocol, values: Record<string, string>) {
  const { interfaceName, serverAddress, username, password } = values;

  switch (protocol) {
    case "l2tp":
      return [
        "/interface l2tp-client",
        `add name="${interfaceName}" connect-to="${serverAddress}" user="${username}" password="${password}" \\`,
        "  disabled=no add-default-route=no use-ipsec=yes ipsec-secret=\"\"",
      ].join("\n");
    case "pptp":
      return [
        "/interface pptp-client",
        `add name="${interfaceName}" connect-to="${serverAddress}" user="${username}" password="${password}" \\`,
        "  disabled=no add-default-route=no",
      ].join("\n");
    case "wireguard":
      return [
        `/interface wireguard add name="${interfaceName}" listen-port=13231`,
        `/interface wireguard peers`,
        `add interface="${interfaceName}" public-key="<SERVER_PUBLIC_KEY>" endpoint-address="${serverAddress}" \\`,
        "  endpoint-port=13231 allowed-address=0.0.0.0/0 persistent-keepalive=25s",
      ].join("\n");
    case "openvpn":
    default:
      return [
        "/interface ovpn-client",
        `add name="${interfaceName}" connect-to="${serverAddress}" user="${username}" password="${password}" \\`,
        "  disabled=no add-default-route=no cipher=aes256 auth=sha256",
      ].join("\n");
  }
}

const PROTOCOL_LABEL: Record<Protocol, string> = {
  l2tp: "L2TP",
  pptp: "PPTP",
  wireguard: "WireGuard",
  openvpn: "OpenVPN",
};

export function VpnGenerator() {
  const [protocol, setProtocol] = useState<Protocol>("l2tp");
  const [values, setValues] = useState({
    interfaceName: "vpn-out1",
    serverAddress: "",
    username: "",
    password: "",
  });
  const [script, setScript] = useState<string | null>(null);

  function handleChange(key: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={protocol} onValueChange={(v) => setProtocol(v as Protocol)}>
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(PROTOCOL_LABEL).map(([key, label]) => (
            <TabsTrigger key={key} value={key}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="interfaceName">Nama Interface</Label>
          <Input
            id="interfaceName"
            value={values.interfaceName}
            onChange={(e) => handleChange("interfaceName", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="serverAddress">Server Address</Label>
          <Input
            id="serverAddress"
            placeholder="vpn.contoh.com"
            value={values.serverAddress}
            onChange={(e) => handleChange("serverAddress", e.target.value)}
          />
        </div>
        {protocol !== "wireguard" && (
          <>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={values.username}
                onChange={(e) => handleChange("username", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={values.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <Button type="button" onClick={() => setScript(buildScript(protocol, values))}>
        Generate Script
      </Button>

      {script && <CopyableOutput value={script} label="Konfigurasi RouterOS" />}
    </div>
  );
}
