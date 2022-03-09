import * as amqp from 'amqplib';
import { Connection } from 'amqplib';

class RabbitmqWrapper {
  private _client?: Connection

  get client() {
    if(!this._client) {
      throw new Error('Cannot access RabbitMq');
    }

    return this._client;
  }

  async connect(url: string) {
    try {
      this._client = await amqp.connect(url);
      console.log('Connected to RabbitMq Successfully!');
    } catch(err) {
      console.error(err);
    }
      

      // this._client.on('error', (err) => {
      //   console.error("Connection error:",err.message);
      // });
      
      // this._client.on('close', (err) => {
      //   console.error("Connection closed:", err.message);
      // });

    
    
  }
}
 
export const rabbitmqWrapper = new RabbitmqWrapper();