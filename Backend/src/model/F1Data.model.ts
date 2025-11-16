import mongoose, { Schema, Document } from "mongoose";

export interface ITelemetry extends Document {
  payload: Buffer;   // ArrayBuffer converted to Buffer
  onTrack: boolean;
  createdAt: Date;
}

const TelemetrySchema: Schema = new Schema({
  payload: { type: Buffer, required: true },
  onTrack: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});



export const TelemetryModel = mongoose.model<ITelemetry>("Telemetry", TelemetrySchema);



