/** Worker environment bindings (all secrets — see README.md). */
export interface Env {
  /** Twilio account auth token — used to validate X-Twilio-Signature. */
  TWILIO_AUTH_TOKEN: string;
  /** Anthropic API key for the Messages API. */
  ANTHROPIC_API_KEY: string;
  /** Telegram bot token used to message Eugene. */
  TELEGRAM_BOT_TOKEN: string;
  /** Eugene's Telegram chat id (515815145). */
  ADMIN_TELEGRAM_CHAT_ID: string;
  /** Supabase project URL, e.g. https://xxxx.supabase.co */
  SUPABASE_URL: string;
  /** Supabase service-role key (server-side only, bypasses RLS). */
  SUPABASE_SERVICE_ROLE_KEY: string;
  /** Twilio account SID — for the Messages REST API (booking-link SMS). */
  TWILIO_ACCOUNT_SID: string;
  /** Twilio Messaging Service SID (MG…) used as the SMS sender. */
  TWILIO_MESSAGING_SERVICE_SID: string;
}

// ---------------------------------------------------------------------------
// Anthropic Messages API (raw HTTP — no SDK in Workers)
// ---------------------------------------------------------------------------

export interface TextBlock {
  type: "text";
  text: string;
}

export interface ToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultBlock {
  type: "tool_result";
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

export type AssistantContentBlock = TextBlock | ToolUseBlock;
export type UserContentBlock = TextBlock | ToolResultBlock;

export interface MessageParam {
  role: "user" | "assistant";
  content: string | AssistantContentBlock[] | UserContentBlock[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

// ---------------------------------------------------------------------------
// Twilio ConversationRelay WebSocket protocol (incoming messages)
// ---------------------------------------------------------------------------

export interface RelaySetupMessage {
  type: "setup";
  sessionId?: string;
  callSid?: string;
  from?: string;
  to?: string;
  direction?: string;
}

export interface RelayPromptMessage {
  type: "prompt";
  /** Transcribed caller speech. */
  voicePrompt?: string;
  lang?: string;
  /** false for partial transcriptions; act only on final ones. */
  last?: boolean;
}

export interface RelayInterruptMessage {
  type: "interrupt";
  utteranceUntilInterrupt?: string;
  durationUntilInterruptMs?: number;
}

export interface RelayErrorMessage {
  type: "error";
  description?: string;
}

export interface RelayDtmfMessage {
  type: "dtmf";
  digit?: string;
}

export type RelayInboundMessage =
  | RelaySetupMessage
  | RelayPromptMessage
  | RelayInterruptMessage
  | RelayErrorMessage
  | RelayDtmfMessage;

// ---------------------------------------------------------------------------
// Call session state
// ---------------------------------------------------------------------------

export interface TranscriptEntry {
  role: "caller" | "agent" | "system";
  text: string;
}
