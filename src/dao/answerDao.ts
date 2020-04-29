import { DDB } from '../client/dynamoDB'
import { getVariable } from '../ common/util'

export class AnswerDao {
  table = `slack-survey-${getVariable('STAGE')}-answer`

  async put(surveyId: number, userId: string, answers: Record<string, string>): Promise<any> {
    const putItem = {
      TableName: this.table,
      Item: {
        survey_id: surveyId,
        user: userId,
        ...answers,
      },
    }
    try {
      await DDB.put(putItem).promise()
      console.log(`${this.table}に保存した(${surveyId}: ${userId})`)
    } catch (e) {
      console.error('ReactionDao.putRecord failed')
      console.error(e)
    }
  }
}
