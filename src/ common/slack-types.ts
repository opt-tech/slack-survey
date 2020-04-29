import { Block, KnownBlock, View } from '@slack/web-api'
import { ParsedUrlQuery } from 'querystring'

export type RequestBody =
  | MessageRequest
  | ReactionRequest
  | SlashCommandRequest
  | InteractiveComponentRequest

export interface EventRequest {
  token: string
  team_id: string
  api_app_id: string
  type: string
  event_id: string
  event_time: number
  event: {
    type: 'message' | 'reaction_added' | 'app_home_opened'
    user: string
    username: string
  }
  authed_users: string[]
  isBase64Encoded: boolean
  challenge?: string // for verification
}

export interface MessageRequest extends EventRequest {
  event: EventRequest['event'] & {
    type: 'message'
    subtype?: string
    client_msg_id: string
    text: string
    ts: string
    channel_type: string
    channel: string
    event_ts: string
    thread_ts?: string
    bot_id?: string
  }
}

export interface ReactionRequest extends EventRequest {
  event: EventRequest['event'] & {
    type: 'reaction_added'
    item: {
      type: string
      channel: string
      ts: string
    }
    reaction: string
    event_ts: string
  }
}

export interface SlashCommandRequest extends ParsedUrlQuery {
  token: string
  team_id: string
  team_domain: string
  channel_id: string
  channel_name: string
  user_id: string
  user_name: string
  command: string
  text: string
  response_url: string
  trigger_id: string
}

export interface InteractiveComponentRequest extends ParsedUrlQuery {
  payload: string
}

export type Payload = MessageActionPayload | BlockActionsPayload | ViewSubmissionPayload

export interface PayloadBase {
  type: string
  token: string
  team: {
    id: string
    domain: string
  }
  user: User
  channel: Channel // TODO: | undefined にしたい
  callback_id: string
  trigger_id: string
  message_ts: string
  response_url: string
}

export interface MessageActionPayload extends PayloadBase {
  type: 'message_action'
  action_ts: string
  user: User
  callback_id: string
  message_ts: string
  message: {
    type: 'message' | string
    subtype: 'bot_message' | string
    text: string
    ts: string
    username: string
    bot_id?: string
    attachments?: {
      text: string
      title: string
      id: string
      title_link: string
      fallback: string
    }[]
  }
}

export interface BlockActionsPayload extends PayloadBase {
  type: 'block_actions'
  user: {
    id: string
    username: string
    name: string
    team_id: string
  }
  api_app_id: string
  container: {
    type: 'message' | string
    message_ts: string
    channel_id: string
    is_ephemeral: boolean
  }
  message: {
    type: 'message' | string
    subtype: 'bot_message' | string
    text: string
    ts: string
    username: string
    bot_id: string
    blocks: (Block | KnownBlock)[]
  }
  actions: (Button | Overflow)[]
}

export interface ViewSubmissionPayload extends PayloadBase {
  type: 'view_submission'
  user: {
    id: string
    username: string
    name: string
    team_id: string
  }
  api_app_id: string
  view: {
    id: string
    team_id: string
    state: {
      values: unknown
    }
    hash: string
    private_metadata?: string
    previous_view_id?: string
    root_view_id: string
    app_id: string
    external_id: string
    app_installed_team_id: string
    bot_id: string
  } & View
}

export interface Actions {
  type: 'button' | 'overflow'
  action_id: string
  block_id: string
  action_ts: string
}

export interface Button extends Actions {
  type: 'button'
  text: string
  value: string
}
export interface Overflow extends Actions {
  type: 'overflow'
  selected_option: {
    text: {
      type: string
      text: string
      emoji: boolean
    }
    value: string
  }
}

export interface User {
  id: string
  name: string
}

export interface Channel {
  id: string
  name: string
}
