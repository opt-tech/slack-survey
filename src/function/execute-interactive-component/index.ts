import { APIGatewayProxyEvent } from 'aws-lambda'
import { parse } from 'querystring'

import { InteractiveComponentRequest, Payload } from '../../ common/slack-types'
import { Response } from '../../ common/types'
import { getVariable, okResponse } from '../../ common/util'
import { SlackClient } from '../../client/slack'
import { createSurveyForm, getActionFromBlockActions, createAnswerObj } from './util'
import { AnswerDao } from '../../dao/answerDao'

const slackClient = new SlackClient()
const answerDao = new AnswerDao()

export async function interactiveComponent(event: APIGatewayProxyEvent): Promise<Response> {
  console.log(event)
  try {
    const body = parse(event.body) as InteractiveComponentRequest
    const payload: Payload = JSON.parse(body.payload)
    console.log(payload)

    if (payload.type === 'block_actions') {
      const action = getActionFromBlockActions(payload)

      // Do tasks.
      if (action.type === 'start_to_answer') {
        await slackClient.viewsOpen(createSurveyForm(payload.trigger_id, action.surveyId))
      }
    }

    if (payload.type === 'view_submission') {
      if (payload.view.callback_id === 'receive_answer') {
        const surveyId = Number(payload.view.private_metadata)
        if (!surveyId) throw new Error('idが不正です')

        const answers = createAnswerObj(surveyId, payload.view.state.values)
        console.log(answers)
        await answerDao.put(surveyId, payload.user.id, answers)
        //TODO 回答があったことをアナウンス
      }
    }

    return okResponse()
  } catch (error) {
    console.error(error)
    const errorMessage = `エラー終了しました\nエラーメッセージ: ${error}`
    const ADMIN_CHANNEL = getVariable('ADMIN_CHANNEL')

    await slackClient.postEphemeral({
      user: 'U5M04AM0E',
      text: errorMessage,
      channel: ADMIN_CHANNEL,
    })
    await slackClient.postMessage({
      text: errorMessage + `\n\`\`\`${event}\`\`\``,
      channel: ADMIN_CHANNEL,
    })
  }
}
