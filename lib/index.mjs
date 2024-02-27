import axios from 'axios'

class GoogleTranslate {
  static async translate (source, target, text) {
    const response = await GoogleTranslate.requestTranslation(
      source,
      target,
      text
    )

    const translation = GoogleTranslate.getSentencesFromJSON(response)

    return translation
  }

  static async requestTranslation (source, target, text) {
    if (text.length >= 5000) {
      throw new Error('Maximum number of characters exceeded: 5000')
    }

    const url = 'https://translate.googleapis.com/translate_a/single?'

    const formData = new URLSearchParams({
      client: 'gtx',
      dt: 't',
      sl: source,
      tl: target,
      q: text
    }).toString()

    try {
      const response = await axios.get(url + formData, {
        responseType: 'arraybuffer'
      })
      return response.data
    } catch (error) {
      throw new Error(error)
    }
  }

  static getSentencesFromJSON (json) {
    const sentencesArray = JSON.parse(json)
    let sentences = ''

    if (!sentencesArray || !sentencesArray[0]) {
      throw new Error(
        'Google detected unusual traffic from your computer network, try again later (2 - 48 hours)'
      )
    }

    sentencesArray[0].forEach((s) => {
      sentences += s[0] || ''
    })

    return sentences
  }
}

module.exports = GoogleTranslate
