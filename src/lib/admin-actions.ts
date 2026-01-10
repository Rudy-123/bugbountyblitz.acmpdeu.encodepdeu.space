'use server';

import { challengesWithFlags } from "./challenges-server";

export async function getChallengesWithFlags() {
  return challengesWithFlags;
}

export async function getDnsChallenge() {
  return challengesWithFlags.find(c => c.simulation === 'dns');
}