import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn=(...inputs:ClassValue[])=>twMerge(clsx(inputs));
export const formatCO2=(n:number)=>`${n.toFixed(1)} kg`;
export const pretty=(s:string)=>s.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase());
