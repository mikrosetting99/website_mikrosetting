interface SiteLogoProps {
  siteName: string;
  logoUrl?: string;
  className?: string;
  hideNameOnMobile?: boolean;
}

export function SiteLogo({ siteName, logoUrl, className, hideNameOnMobile }: SiteLogoProps) {
  const [first, ...rest] = siteName.split(" ");
  const restText = rest.join(" ");

  return (
    <span className={`flex items-center gap-1.5 text-lg font-bold tracking-tight ${className ?? ""}`}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin-provided arbitrary URL, no fixed domain to whitelist
        <img src={logoUrl} alt={siteName} className="h-7 w-7 shrink-0 rounded-md object-cover" />
      ) : (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          {siteName.charAt(0).toUpperCase()}
        </span>
      )}
      <span className={hideNameOnMobile ? "hidden sm:inline" : undefined}>
        {restText ? (
          <>
            {first.toUpperCase()} <span className="text-primary">{restText.toUpperCase()}</span>
          </>
        ) : (
          first
        )}
      </span>
    </span>
  );
}
