// gpt-3.5-turbo chat ai util file

const axios = require('axios').default


module.exports = class GPTClient {

  static __uuidv4() {
    // Generate random uuid
    return '12345678-1234-1234-1234-123456789abc';
  } 
  
  // Request headers
  static __headers = {
    'authority': 'you.com',
    'accept': 'text/event-stream',
    'accept-language': 'en,fr-FR;q=0.9,fr;q=0.8,es-ES;q=0.7,es;q=0.6,en-US;q=0.5,am;q=0.4,de;q=0.3',
    'cache-control': 'no-cache',
    'referer': 'https://you.com/search?q=who+are+you&tbm=youchat',
    'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'cookie': `safesearch_guest=Moderate; uuid_guest=${GPTClient.__uuidv4()}`,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  };

  // Extract and serialize JSON from response
  static __extractAndSerializeJSON(input) {
    let jsonString = input.split('```')[1].substring(4);
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
    return null
  }

  // Send message to gpt-3.5-turbo
  static async __sendMessage(q) {
  
    try {
      
      // Getting response
      const res = await axios.get(`https://you.com/api/streamingSearch?${new URLSearchParams({
        q,
        page: 1,
        count: 10,
        safe_search: 'Moderate',
        on_shopping_page: false,
        mkt: '',
        response_filter: 'WebPages,Translations,TimeZone,Computation,RelatedSearches',
        domain: 'youchat',
        query_trace_id: GPTClient.__uuidv4(),
        chat: []
      })}`, { 
        headers: GPTClient.__headers,
        referrerPolicy: "strict-origin-when-cross-origin",
        method: "GET",
        withCredentials: true
      });

      let msg = '';
    
      // Extracting valuable data
      for (const line of res.data.split('\n')) {
        if (line.startsWith('data: {"youChatToken":')) {
          msg += JSON.parse(line.substring(6))?.youChatToken;
        }
      }
      
      return msg;
    }
    catch (error) {
      console.warn('Error getting response:', error.message ?? error.data ?? 'unknown error');
      return null
    }
  };

  /**
   * Method gets (serialized) questions from gpt-3.5-turbo.
   * @param title the article title
   * @param content the article content
   */
  static async getQuestions(title, content) {
    
    const prompt = `Generate a JSON array with questions and answers about the provided article:\n
      Article title: ${title}\n
      Article content: ${content}`;
  
    // Get message from gpt-3.5-turbo
    const msg = await GPTClient.__sendMessage(prompt);

    if (!msg) {
      return null;
    }
  
    // Extract questions from message
    const questions = GPTClient.__extractAndSerializeJSON(msg);

    return questions;
  };
};
