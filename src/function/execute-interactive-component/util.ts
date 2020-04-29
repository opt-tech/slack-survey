import { ViewsOpenArguments, KnownBlock, Block } from '@slack/web-api'

import { BlockActionsPayload } from '../../ common/slack-types'
import { BlockActionValue } from '../../ common/types'

export function getActionFromBlockActions(payload: BlockActionsPayload): BlockActionValue {
  const action = payload.actions.shift()

  let value: BlockActionValue
  switch (action.type) {
    case 'button':
      value = JSON.parse(action.value)
      break
    case 'overflow':
      value = JSON.parse(action.selected_option.value)
      break
  }
  console.log(value)
  if (!value) throw new Error('action.typeが不正です')
  return value
}

export function createSurveyForm(triggerId: string, surveyId: number): ViewsOpenArguments {
  //TODO DBからsurveyを照会
  //TODO 動的にフォームを組み立てる
  console.log(surveyId)
  const blocks: (KnownBlock | Block)[] = [
    {
      type: 'input',
      block_id: '1',
      label: {
        type: 'plain_text',
        text: 'アンケートはSlackで回答できると楽だ',
        emoji: true,
      },
      element: {
        type: 'static_select',
        initial_option: { text: { type: 'plain_text', text: 'はい' }, value: 'はい' },
        action_id: 'action',
        placeholder: {
          type: 'plain_text',
          text: '選んでね',
          emoji: true,
        },
        options: [
          { text: { type: 'plain_text', text: 'はい' }, value: 'はい' },
          { text: { type: 'plain_text', text: 'いいえ' }, value: 'いいえ' },
        ],
      },
    },
    {
      type: 'input',
      block_id: '2',
      optional: true,
      label: {
        type: 'plain_text',
        text: 'ぽよ？',
      },
      element: {
        type: 'plain_text_input',
        action_id: 'action',
        initial_value: 'ぽよ',
        min_length: 1,
        max_length: 10,
        placeholder: {
          type: 'plain_text',
          text: 'ぽよ',
          emoji: true,
        },
      },
    },
    {
      type: 'input',
      block_id: '3',
      label: {
        type: 'plain_text',
        text: 'ぽよ？',
        emoji: true,
      },
      element: {
        type: 'static_select',
        action_id: 'action',
        placeholder: {
          type: 'plain_text',
          text: 'ぽよ',
          emoji: true,
        },
        options: [
          { text: { type: 'plain_text', text: 'ぽよ' }, value: 'ぽよ' },
          { text: { type: 'plain_text', text: 'ぷよ' }, value: 'ぷよ' },
          { text: { type: 'plain_text', text: 'ぴよ' }, value: 'ぴよ' },
        ],
      },
    },

    {
      type: 'divider',
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text:
            '※ ユーザー情報も送信します\n※ 回答は何度でもできますが、最後の回答しか記録されません',
        },
      ],
    },
  ]

  const formBlock: ViewsOpenArguments = {
    trigger_id: triggerId,
    view: {
      type: 'modal',
      callback_id: `receive_answer`,
      title: {
        type: 'plain_text',
        text: 'アンケート回答',
      },
      submit: {
        type: 'plain_text',
        text: '送信',
      },
      close: {
        type: 'plain_text',
        text: 'キャンセル',
      },
      blocks,
      private_metadata: '1',
    },
  }
  console.log('formBlock is ...')
  console.log(formBlock)
  return formBlock
}

export function createAnswerObj(
  surveyId: number,
  valueSets: Record<string, any>,
): Record<string, any> {
  console.log(valueSets)
  const pattern: Record<string, Function> = {
    plain_text_input: (v: any) => v.action.value,
    static_select: (v: any) => v.action.selected_option.value,
  }

  return Object.keys(valueSets).reduce((acc, cur) => {
    const valueSet = valueSets[cur]
    const value = pattern[valueSet.action.type](valueSets[cur])
    return { ...acc, [`${surveyId}_${cur}`]: value }
  }, {})
}
