// generated using -> https://transform.tools/json-to-typescript

export interface AssemblyResponse {
  id: string
  language_model: string
  acoustic_model: string
  language_code: string
  status: string
  audio_url: string
  text: string
  words: Word[]
  utterances: any
  confidence: number
  audio_duration: number
  punctuate: boolean
  format_text: boolean
  dual_channel: any
  webhook_url: any
  webhook_status_code: any
  webhook_auth: boolean
  webhook_auth_header_name: any
  speed_boost: boolean
  auto_highlights_result: any
  auto_highlights: boolean
  audio_start_from: any
  audio_end_at: any
  word_boost: any[]
  boost_param: any
  filter_profanity: boolean
  redact_pii: boolean
  redact_pii_audio: boolean
  redact_pii_audio_quality: any
  redact_pii_policies: any
  redact_pii_sub: any
  speaker_labels: boolean
  content_safety: boolean
  iab_categories: boolean
  content_safety_labels: ContentSafetyLabels
  iab_categories_result: IabCategoriesResult
  language_detection: boolean
  custom_spelling: any
  cluster_id: any
  throttled: any
  auto_chapters: boolean
  summarization: boolean
  summary_type: any
  summary_model: any
  disfluencies: boolean
  sentiment_analysis: boolean
  chapters: Chapter[]
  sentiment_analysis_results: any
  entity_detection: boolean
  entities: any
  summary: any
}

export interface Word {
  text: string
  start: number
  end: number
  confidence: number
  speaker: any
}

export interface ContentSafetyLabels {
  status: string
  results: any[]
  summary: Summary
}

export interface Summary {}

export interface IabCategoriesResult {
  status: string
  results: any[]
  summary: Summary2
}

export interface Summary2 {}

export interface Chapter {
  summary: string
  gist: string
  headline: string
  start: number
  end: number
}
