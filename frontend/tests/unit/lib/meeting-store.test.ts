import { describe, it, expect, beforeEach } from "vitest";
import { useMeetingStore } from "@/stores/meeting-store";

describe("useMeetingStore", () => {
  beforeEach(() => {
    useMeetingStore.getState().reset();
  });

  it("has correct initial state", () => {
    const state = useMeetingStore.getState();
    expect(state.activeMeeting).toBeNull();
    expect(state.isInMeeting).toBe(false);
    expect(state.isRecording).toBe(false);
    expect(state.isMuted).toBe(false);
    expect(state.isCameraOff).toBe(false);
    expect(state.isScreenSharing).toBe(false);
    expect(state.participantCount).toBe(0);
  });

  it("setInMeeting updates state", () => {
    useMeetingStore.getState().setInMeeting(true);
    expect(useMeetingStore.getState().isInMeeting).toBe(true);
  });

  it("setRecording updates state", () => {
    useMeetingStore.getState().setRecording(true);
    expect(useMeetingStore.getState().isRecording).toBe(true);
  });

  it("toggleMute flips mute state", () => {
    expect(useMeetingStore.getState().isMuted).toBe(false);
    useMeetingStore.getState().toggleMute();
    expect(useMeetingStore.getState().isMuted).toBe(true);
    useMeetingStore.getState().toggleMute();
    expect(useMeetingStore.getState().isMuted).toBe(false);
  });

  it("toggleCamera flips camera state", () => {
    expect(useMeetingStore.getState().isCameraOff).toBe(false);
    useMeetingStore.getState().toggleCamera();
    expect(useMeetingStore.getState().isCameraOff).toBe(true);
  });

  it("toggleScreenShare flips screen sharing state", () => {
    expect(useMeetingStore.getState().isScreenSharing).toBe(false);
    useMeetingStore.getState().toggleScreenShare();
    expect(useMeetingStore.getState().isScreenSharing).toBe(true);
  });

  it("setParticipantCount updates count", () => {
    useMeetingStore.getState().setParticipantCount(5);
    expect(useMeetingStore.getState().participantCount).toBe(5);
  });

  it("setActiveMeeting stores meeting object", () => {
    const meeting = { id: "m1", title: "Standup" } as any;
    useMeetingStore.getState().setActiveMeeting(meeting);
    expect(useMeetingStore.getState().activeMeeting).toEqual(meeting);
  });

  it("reset restores initial state", () => {
    useMeetingStore.getState().setInMeeting(true);
    useMeetingStore.getState().toggleMute();
    useMeetingStore.getState().setRecording(true);
    useMeetingStore.getState().reset();
    const state = useMeetingStore.getState();
    expect(state.isInMeeting).toBe(false);
    expect(state.isMuted).toBe(false);
    expect(state.isRecording).toBe(false);
  });
});
