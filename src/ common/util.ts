import { RequestBody } from './slack-types'

export function camelCase(str: string): string {
  return str.replace(/[-_](.)/g, (m, g) => g.toUpperCase()).replace(/^./, v => v.toLowerCase())
}

export function snakeCase(str: string): string {
  return str.replace(/^./, v => v.toLowerCase()).replace(/[A-Z]/g, g => `_${g.toLowerCase()}`)
}

export function pascalCase(str: string): string {
  return str.replace(/[-_](.)/g, (m, g) => g.toUpperCase()).replace(/^./, v => v.toUpperCase())
}

export function getVariable(key: string): string {
  const variable = process.env[key]
  if (!variable) throw new Error(`環境変数'${key}'が取得できませんでした`)
  return variable
}
export function getVariables(keys: string[]): Record<string, string> {
  return keys.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: getVariable(cur),
    }),
    {},
  )
}

export function verifySubscription(challenge: string | undefined): boolean {
  let ret = false
  if (challenge) {
    console.log('Slack App Subscription Verification')
    ret = true
  }
  return ret
}

export function okResponse(body?: string) {
  const responseBody = body ? JSON.stringify(body) : ''
  return { statusCode: 200, body: responseBody }
}
