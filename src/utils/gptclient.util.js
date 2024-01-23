
import { OpenAI } from 'openai'
import { API_KEY_OPENAI } from '../configs/apikeys.config'


export class GPTClient {

  // OpenAI client
  static openai = new OpenAI({ 
    apiKey: API_KEY_OPENAI,
    dangerouslyAllowBrowser: true
  })

  // Extract and serialize JSON from response
  static __extractAndSerializeJSON(input) {
    // let jsonString = input.split('```')[1].substring(4);
    try {
      console.log('input:', input)
      return JSON.parse(input);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
    return null
  }
  
  /**
   * Method gets (serialized) questions from gpt-3.5-turbo.
   * @param title the article title
   * @param content the article content
   */
  static async getQuestions(title, content) {
    
    const prompt = `Generate a JSON array with questions and answers about the provided article:\n
      Article title: ${title}\n
      Article content: ${content}`
  
    // Get message from gpt-3.5-turbo
    const completion = await GPTClient.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt }, 
        { role: 'system', content: 'Write in the following format: [{question: string, answer: string | number, opts?: string[4]}], when the question could either have a simple string answer, or multiple options with the correct number index answer' }
      ]
    })

    // Extract message from response
    const msg = completion.choices[0].message.content

    // Extract questions from message
    const questions = GPTClient.__extractAndSerializeJSON(msg)

    // Return questions
    return questions
  }
}
