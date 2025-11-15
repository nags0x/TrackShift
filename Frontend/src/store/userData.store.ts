import {create} from 'zustand'

export interface data {
    speed: number,
    rpm: number,
    brake: number,
    throttle: number,
    steering: number,
    gear: number,
    fuel: number,
    tireTemps: { fl: number, fr: number
      , rl: number, rr:number },
    trackPosition: number,
}

type userDataComplete = {
    Data:data,
    setData:(telemetryData:data)=> void;
}


export const useUserData = create<userDataComplete>((set , get)=>({
    Data:{
        speed:0,
        rpm:0,
        brake:0,
        throttle:0,
        steering:0,
        gear:0,
        fuel:100,
        tireTemps:{
            fl:0,fr:0,rl:0,rr:0
        },
        trackPosition:0,
    },

    setData:(telemetry:data):void=>{
        set({Data:telemetry})
    }
}))