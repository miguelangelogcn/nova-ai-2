'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-mentor-chat.ts';
import '@/ai/flows/swot-analysis.ts';
import '@/ai/flows/disc-analysis.ts';
