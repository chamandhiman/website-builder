interface LandingHudProps {
  currentPanelName: string;
  progressPercent: number;
  currentPanelIndex: number;
  totalPanels: number;
}

export function LandingHud({
  currentPanelName,
  progressPercent,
  currentPanelIndex,
  totalPanels,
}: LandingHudProps) {
  return (
    <div className="hud" aria-hidden="true">
      <span className="cur" id="hudName">
        {currentPanelName}
      </span>
      <span className="rail">
        <i
          id="hudBar"
          style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
        />
      </span>
      <span id="hudNum">
        {currentPanelIndex + 1} / {totalPanels}
      </span>
    </div>
  );
}
