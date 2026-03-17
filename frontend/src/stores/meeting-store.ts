import { create } from "zustand";
import type { Meeting } from "@/types/meeting";

interface MeetingState {
  activeMeeting: Meeting | null;
  isInMeeting: boolean;
  isRecording: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  participantCount: number;

  setActiveMeeting: (meeting: Meeting | null) => void;
  setInMeeting: (v: boolean) => void;
  setRecording: (v: boolean) => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => void;
  setParticipantCount: (n: number) => void;
  reset: () => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  activeMeeting: null,
  isInMeeting: false,
  isRecording: false,
  isMuted: false,
  isCameraOff: false,
  isScreenSharing: false,
  participantCount: 0,

  setActiveMeeting: (activeMeeting) => set({ activeMeeting }),
  setInMeeting: (isInMeeting) => set({ isInMeeting }),
  setRecording: (isRecording) => set({ isRecording }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleCamera: () => set((s) => ({ isCameraOff: !s.isCameraOff })),
  toggleScreenShare: () => set((s) => ({ isScreenSharing: !s.isScreenSharing })),
  setParticipantCount: (participantCount) => set({ participantCount }),
  reset: () =>
    set({
      activeMeeting: null,
      isInMeeting: false,
      isRecording: false,
      isMuted: false,
      isCameraOff: false,
      isScreenSharing: false,
    }),
}));
