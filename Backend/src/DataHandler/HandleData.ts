import { handleQueueData } from "../controllers/queueData.controller.ts";
import { relayServer } from "../index.ts";
import { SocketEvents } from "../types/SocketEvents.ts";

const BATCH_SIZE = 10;
const BATCH_TIME = 50; //For very high frequency sensors data reduce it to 20-30

export interface StreamData { //Used double ended queue , in order to reduce the O(n) time operation to O(1);
  payload: ArrayBuffer;   // the CSV row
  onTrack: boolean;  // priority
}

class PrioritizeQueue {
  private highPriority: StreamData[] = [];
  private lowPriority: StreamData[] = [];

  enqueue(data: StreamData) {
    if (data.onTrack) {
      this.highPriority.push(data);
    } else {
      this.lowPriority.push(data);
    }
  }

  dequeueBatch(batchSize: number): StreamData[] {
    const batch: StreamData[] = [];

    while (batch.length < batchSize) {
      if (this.highPriority.length > 0) {
        batch.push(this.highPriority.shift()!); //! -> defines that the shift won't return a unedfined value
      } else if (this.lowPriority.length > 0) {
        batch.push(this.lowPriority.shift()!);
      } else break;
    }

    return batch;
  }

  hasItems(): boolean {
    return this.highPriority.length > 0 || this.lowPriority.length > 0; 
  }
}

// Instantiate a global queue
const priorityQueue = new PrioritizeQueue();

export async function handleStreamedData(data: ArrayBuffer, onTrack: boolean) { //Handles incoming stream
  // Add to queue
  priorityQueue.enqueue({ payload: data, onTrack });

  //This process the queue immediately 

  setInterval(async ()=>{

    if(!priorityQueue.hasItems()) return;

    const batch = priorityQueue.dequeueBatch(BATCH_SIZE);
    console.log("Batching data && sending")
    console.log(batch)


    //Send the batch to store in mongoDB
    // await handleQueueData(batch) 

    batch.forEach(d => {
    relayServer.io.emit(SocketEvents.MOCK_DATA, d.payload);
});



  } , BATCH_TIME)

}


