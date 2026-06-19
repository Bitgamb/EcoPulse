import type { CarbonEntry, EcoAction, Goal } from "@/types/carbon";
const day=(offset:number)=>{const d=new Date();d.setDate(d.getDate()+offset);return d.toISOString().slice(0,10)};
export const demoEntries:CarbonEntry[]=[
 {id:"e1",category:"transport",activity_type:"car_km",value:32,unit:"km",co2_amount:6.14,entry_date:day(0),note:"Office commute"},
 {id:"e2",category:"food",activity_type:"chicken_meal",value:2,unit:"meals",co2_amount:7,entry_date:day(-1)},
 {id:"e3",category:"electricity",activity_type:"electricity_kwh",value:5.5,unit:"kWh",co2_amount:4.51,entry_date:day(-2)},
 {id:"e4",category:"waste",activity_type:"recycled_waste_kg",value:2,unit:"kg",co2_amount:-1,entry_date:day(-3)},
 {id:"e5",category:"transport",activity_type:"metro_km",value:18,unit:"km",co2_amount:.63,entry_date:day(-4)},
 {id:"e6",category:"shopping",activity_type:"online_delivery",value:2,unit:"orders",co2_amount:2.4,entry_date:day(-8)},
 {id:"e7",category:"food",activity_type:"vegetarian_meal",value:3,unit:"meals",co2_amount:4.5,entry_date:day(-12)}
];
export const demoActions:EcoAction[]=[
 {id:"a1",title:"Ride the metro once",description:"Replace one short car journey this week.",category:"transport",estimated_saving:1.57,difficulty:"Easy",completed:true},
 {id:"a2",title:"Set AC to 24°C",description:"Keep cooling efficient for one full day.",category:"electricity",estimated_saving:1.2,difficulty:"Easy",completed:true},
 {id:"a3",title:"Plan two plant-based meals",description:"Swap two meat meals for seasonal vegetarian plates.",category:"food",estimated_saving:7,difficulty:"Medium",completed:false},
 {id:"a4",title:"Carry a reusable bottle",description:"Avoid single-use bottles for three days.",category:"waste",estimated_saving:.32,difficulty:"Easy",completed:false},
 {id:"a5",title:"Bundle your deliveries",description:"Combine upcoming purchases into one order.",category:"shopping",estimated_saving:1.2,difficulty:"Medium",completed:false}
];
export const demoGoals:Goal[]=[
 {id:"g1",title:"Save 10 kg this month",category:null,target_reduction:10,current_progress:3.77,deadline:day(18),status:"active"},
 {id:"g2",title:"Lower commute emissions",category:"transport",target_reduction:5,current_progress:1.57,deadline:day(25),status:"active"}
];
