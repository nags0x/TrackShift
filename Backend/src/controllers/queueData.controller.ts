import { TelemetryModel } from "../model/F1Data.model.ts";
import type { StreamData } from "../DataHandler/HandleData";

export const handleQueueData = async (batch: StreamData[]) => {
  if (!batch.length) return;

  // Convert ArrayBuffers to Node.js Buffers
  const docs = batch.map((d) => ({
    payload: Buffer.from(d.payload),
    onTrack: d.onTrack,
  }));

  try {
    // Insert many at once
    await Promise.all(batch.map(item => TelemetryModel.create({
  payload: Buffer.from(item.payload),
  onTrack: item.onTrack,
})));

    console.log(`✅ Saved batch of ${docs.length} telemetry entries`);
  } catch (err) {
    console.error("❌ Error saving telemetry batch", err);
  }
};


