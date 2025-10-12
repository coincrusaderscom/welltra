
export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number;
}

export interface MeasurementEntry {
    date: string; // YYYY-MM-DD
    waist?: number;
    arm?: number;
    thigh?: number;
}