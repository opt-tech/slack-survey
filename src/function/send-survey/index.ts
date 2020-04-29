import 'source-map-support/register'

import { SectionBlock } from '@slack/web-api'
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'
import { parse } from 'querystring'

import { SlashCommandRequest } from '../../ common/slack-types'
import { Response, AnswerAction } from '../../ common/types'
import { okResponse } from '../../ common/util'
import { SlackClient } from '../../client/slack'
import { surveys } from './resource'

const slackClient = new SlackClient()

export const sendSurvey: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<Response> => {
  console.log(event)
  const body = parse(event.body) as SlashCommandRequest
  console.log(body)
  const surveyId = Number(body.text)

  // TODO DB化する
  const survey = surveys.find(v => v.id === surveyId)
  if (!survey) throw new Error('該当のアンケートはありません')

  // アンケート開始のボタン配信
  const actionValue: AnswerAction = {
    type: 'start_to_answer',
    surveyId: survey.id,
  }

  const content: SectionBlock = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `アンケートに回答してね *「${survey.title}」*`,
    },
    accessory: {
      type: 'button',
      text: {
        type: 'plain_text',
        emoji: true,
        text: '回答する',
      },
      value: JSON.stringify(actionValue),
    },
  }

  await slackClient.postMessage({
    channel: body.channel_id,
    text: '',
    username: 'アンケート',
    blocks: [content],
  })

  return okResponse()
}
