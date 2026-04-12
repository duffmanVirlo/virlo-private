export type ShowSayMap = {
  must_show: {
    instruction: string;
    why: string;
  }[];
  can_say: {
    line: string;
    purpose: string;
  }[];
  never_say: {
    blocked_phrase_type: string;
    instead: string;
  }[];
};
