import type { Metadata } from "next";import { Manrope,Newsreader } from "next/font/google";import "./globals.css";
const manrope=Manrope({subsets:["latin"],variable:"--font-manrope"});const newsreader=Newsreader({subsets:["latin"],variable:"--font-newsreader"});
export const metadata:Metadata={title:"EcoPulse | Personal carbon tracker",description:"Track your footprint. Build greener habits.",icons:{icon:[{url:"/icon.png",sizes:"64x64",type:"image/png"}],apple:[{url:"/apple-icon.png",sizes:"180x180",type:"image/png"}]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${manrope.variable} ${newsreader.variable} font-sans`}>{children}</body></html>}
