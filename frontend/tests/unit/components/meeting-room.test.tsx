import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MeetingRoom } from "@/components/meetings/meeting-room";
import { useMeetingStore } from "@/stores/meeting-store";

describe("MeetingRoom", () => {
  beforeEach(() => {
    useMeetingStore.getState().reset();
  });

  it("renders the meeting room UI", () => {
    const { container } = render(<MeetingRoom meetingId="meet-1" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders meeting control buttons", () => {
    render(<MeetingRoom meetingId="meet-1" />);
    // Meeting room should have mute, camera, and leave buttons
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});
