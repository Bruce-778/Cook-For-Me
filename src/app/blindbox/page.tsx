import type { Metadata } from "next";
import { BlindBoxClient } from "@/components/blindbox-client";
export const metadata: Metadata={title:"食物盲盒",description:"按人数、时间和忌口生成营养搭配的一桌菜。"};
export default function BlindBoxPage(){return <BlindBoxClient/>;}
