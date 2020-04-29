export type Weaken<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? any : T[P]
}

export interface Response {
  statusCode: number
  body: string
}

export type BlockActionValue = AnswerAction

export interface AnswerAction {
  type: 'start_to_answer' | 'send_answer'
  surveyId: number
}

export interface SubmissionValue {}
