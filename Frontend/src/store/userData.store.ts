import {create} from 'zustand'


export interface data {
    Date: string,
    SessionTime: number,
    Time: number,
    RPM: number,
    Speed: number,
    nGear: number,
    Throttle: number,
    Brake: boolean,
    Status: string,
    Driver: string,
    ES: number,
    Time_td: number,
    TrackPosition: number,
    CurrentLap: number,
    BestLap: number,
    LastLap: number,
    LapDelta: number,
    WeatherCondition: string,
    WeatherTemp: number,
    WeatherWind: number,
    EngineVibration: number,
    Tiretemps: {
        fl: number,
        fr: number,
        rl: number,
        rr: number,
    },
    Fuel: number,
    TrackName: string,
    TrackLocation: string,
}

type userDataComplete = {
    Data:data,
    setData:(telemetryData:data)=> void;
}


export const useUserData = create<userDataComplete>((set , get)=>({
    Data:{
        Date: "",
        SessionTime: 0,
        Time: 0,
        RPM: 0,
        Speed: 0,
        nGear: 0,
        Throttle: 0,
        Brake: false,
        Status: "",
        Driver: "",
        ES: 0,
        Time_td: 0,
        TrackPosition: 0,
        CurrentLap: 0,
        BestLap: 0,
        LastLap: 0,
        LapDelta: 0,
        WeatherCondition: "",
        WeatherTemp: 0,
        WeatherWind: 0,
        EngineVibration: 0,
        Tiretemps: {
            fl: 0,
            fr: 0,
            rl: 0,
            rr: 0,
        },
        Fuel: 100,
        TrackName: "",
        TrackLocation: "",
    },

    setData:(telemetry:data):void=>{
        set({Data:telemetry})
    }
}))