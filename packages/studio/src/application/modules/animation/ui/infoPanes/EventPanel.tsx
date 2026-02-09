import { formatTime } from "@/application/shared/timeFormatter";
import { useFile } from "@/application/state/FileContext";
import { ErrorBoundary } from "@/application/ui/ErrorBoundary";
import { Label } from "@/ui/components/atoms/Label/Label";
import { PanelTitle } from "@/ui/components/atoms/PanelTitle/PanelTitle";
import { Control } from "@/ui/components/molecules/Control/Control";
import { ControlPanel } from "@/ui/components/molecules/ControlPanel/ControlPanel";

export const EventPanel: React.FC<{
  eventId: string;
  activeAnimationId: string;
}> = ({ eventId, activeAnimationId }) => {
  const [file] = useFile();
  const activeAnimation = file.animations[activeAnimationId];

  const event = activeAnimation?.events.find(
    (e) => `event-${e.type}-${e.eventName}` === eventId
  );
  if (!activeAnimation || !event) {
    return null;
  }

  const speed = activeAnimation.speedModifier ?? 1;

  return (
    <ErrorBoundary fallback={<div>Error loading event details</div>}>
      <PanelTitle>Event Details</PanelTitle>
      <ControlPanel>
        <Control label="Name">
          <Label>{event.eventName}</Label>
        </Control>

        <Control label="Trigger at">
          <Label>{formatTime(event.start / speed)}</Label>
        </Control>
      </ControlPanel>
    </ErrorBoundary>
  );
};
