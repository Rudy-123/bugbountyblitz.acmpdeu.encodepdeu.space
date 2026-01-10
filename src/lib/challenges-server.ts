import 'server-only';
import type { Challenge } from './types';

/**
 * Server-only challenges data including flags.
 * This file should NEVER be imported in client components.
 * Use getChallengeMetadata() from challenges.ts for client-side data.
 */
export const challengesWithFlags: Challenge[] = [
  // --- PAST ---
  {
    id: '1',
    title: 'Ancient Cipher',
    era: 'Past',
    points: 100,
    description: 'Every cipher hides its origin, every clock remembers its first beat — seek the moment time was born, and let its pieces come together.',
    longDescription: 'Every cipher hides its origin, every clock remembers its first beat — seek the moment time was born, and let its pieces come together.',
    hints: [
      { cost: 0, text: 'In the realm of numbers, there exists a sacred count that began when the digital cosmos first drew breath. The sum of its very essence holds the key to unraveling what was woven.' },
      { cost: 10, text: 'The ancient scribes used addition to weave their secret, but to unravel it you must walk backward. Sum all digits in the cosmic timestamp, apply modulo 26, then subtract this sacred number from each letter to reveal the truth.' },
      { cost: 20, text: 'Unix epoch time holds the cipher key: add each digit together, mod 26 gives the shift. The cipher was made by adding this to each letter of the plain text - reverse it by subtracting to decode.' },
    ],
    flag: 'FLAG{WELCOMETOENCODEANDACMCTF}',
    decoyFlags: [
      { flag: 'FLAG{NOT_THE_FLAG}', message: 'Oops!! That looks like a decoy.' },
      { flag: 'FLAG{TRY_AGAIN}', message: 'Fooled you!! Nice try though.' }
    ],
  },
  {
    id: '2',
    title: 'The Hidden Papyrus',
    era: 'Past',
    points: 100,
    description: 'The present is what you see — bright, alive, and constantly rewriting itself. But this moment isn\'t where time began. Long before the first flicker reached your screen, something older was etched beneath — silent, unseen, yet still pulsing with the rhythm of the first second. The past rarely speaks, but it leaves quiet fingerprints for those who learn to notice.\n\nWhat stands before you is only the surface of a longer story. The future waits for those who can read between moments — those who know how to turn time backward and listen to its earliest beat. Somewhere below, the truth still lingers… patiently, waiting to be found.',
    longDescription: 'The present is what you see — bright, alive, and constantly rewriting itself. But this moment isn\'t where time began. Long before the first flicker reached your screen, something older was etched beneath — silent, unseen, yet still pulsing with the rhythm of the first second. The past rarely speaks, but it leaves quiet fingerprints for those who learn to notice.\n\nWhat stands before you is only the surface of a longer story. The future waits for those who can read between moments — those who know how to turn time backward and listen to its earliest beat. Somewhere below, the truth still lingers… patiently, waiting to be found.',
    hints: [
      { cost: 0, text: 'The ancients knew that what the eye perceives is but a veil. Beneath the surface of all digital scrolls lies a hidden architecture, readable only to those who know the sacred incantations.' },
      { cost: 10, text: 'When the trinity is squared and multiplied by the sacred seven, then blessed with the four winds of earth, the divine chamber reveals itself among the great multitude of sixty-nine... but beware the false prophets who speak in jest.' },
      { cost: 20, text: 'The math points to sixty-seven, yet the wise know that ancient builders loved their tricks. When mathematics fails and Hindi laughter mocks your efforts, seek the answer to life, the universe, and everything.' },
    ],
    flag: 'FLAG{Savdhan&Sathark!1}',
  },
  {
    id: '3',
    title: 'Forbidden Path',
    era: 'Past',
    points: 150,
    description: 'Some paths are meant to be invisible, written only for eyes that wander where the world does not. A quiet list sleeps in the shadows of the site — the guide to what should stay hidden waits at the very root, and you might uncover a line never meant to be seen.',
    longDescription: 'Some paths are meant to be invisible, written only for eyes that wander where the world does not. A quiet list sleeps in the shadows of the site — the guide to what should stay hidden waits at the very root, and you might uncover a line never meant to be seen.',
    simulation: 'robots',
    hints: [
      { cost: 0, text: 'The mechanical servants of old required instructions. What sacred text guides their metallic steps through the digital realm?' },
      { cost: 10, text: 'The scroll speaks the language of \'txt\' and bears the name of those it commands. It dwells at the root of all things.' },
      { cost: 20, text: 'Sometimes the first forbidden path leads not to treasure, but to another riddle. When letters dance and transformation beckons, let some sleep while others awaken.' },
    ],
    flag: 'FLAG{PRO_BHAIII_!}',
  },
  // --- PRESENT ---
  {
    id: '4',
    title: 'Library Database',
    era: 'Present',
    points: 200,
    description: 'This library system has a collection of books, but there might be more than meets the eye in the database.',
    longDescription: 'The library has digitized their book collection. You can browse books and view their details. However, the book detail endpoint seems to be directly constructing database queries from user input. Can you find what else is hidden in their database?',
    simulation: 'books_api',
    hints: [
      { cost: 0, text: 'First browse the books, then try clicking on one to see its details. Notice the URL pattern.' },
      { cost: 10, text: 'The book ID parameter in the URL might accept more than just numbers.' },
      { cost: 20, text: 'Try classic SQL injection payloads in the book ID parameter.' },
    ],
    flag: 'FLAG{SYSTEM_FAAD_DENGE}', // Update this with your actual flag from the vulnerable API
    decoyFlags: [
      { flag: 'FLAG{BOOKS_FAKE}', message: 'Oops!! Fake books flag.' },
    ],
  },
  {
    id: '5',
    title: 'Cross-Site Scribe',
    era: 'Present',
    points: 250,
    description: 'A previous user left a "helpful" comment, but it seems to be more than just text.',
    longDescription: 'This comment board is supposed to display user messages. However, it seems to lack proper sanitization, allowing scripts to be saved and executed in the browsers of other users. There is a flag hidden in a script left by another user.',
    simulation: 'xss',
    extraData: {
      comment: 'Hey everyone, check out this cool trick! <script>alert("You found me! The flag is FLAG{XSS_STORE}");</script>',
    },
    hints: [
      { cost: 0, text: 'The page content is dynamic. Where could the flag be executing from?' },
      { cost: 20, text: 'If a site is vulnerable to stored XSS, any user can inject JavaScript. The flag is in an alert box. If you don\'t see it, your browser might be blocking it.' },
    ],
    flag: 'FLAG{D3c0d3_M3_If_Y0u_C4n}',
    decoyFlags: [
      { flag: 'FLAG{XSS_FAKE}', message: 'Fooled you!! This one is fake.' }
    ],
  },
  {
    id: '6',
    title: 'Domain Name Secrets',
    era: 'Present',
    points: 250,
    description: 'Some information isn\'t on the web, but in the infrastructure that supports it. Find the TXT record.',
    longDescription: 'The Domain Name System (DNS) can store more than just IP addresses. TXT records are used for various purposes, and sometimes they hold secrets. I\'ll provide you with the domain name - you need to query its TXT records to find the flag.',
    simulation: 'real_dns',
    extraData: {
      domain: 'bugbountyblitz.acmpdeu.encodepdeu.space' // UPDATE THIS WITH YOUR REAL DOMAIN THAT HAS THE TXT RECORD
    },
    hints: [
      { cost: 0, text: 'You\'ll need a tool to look up DNS records. `nslookup` or `dig` are common command-line tools.' },
      { cost: 10, text: 'Try: `nslookup -type=TXT <domain>` or `dig TXT <domain>`' },
      { cost: 20, text: 'The domain name will be provided in the challenge description.' },
    ],
    flag: 'FLAG{SH4KAL4KA_BO0M_B0OM}', // Update this with the actual flag in your DNS TXT record
  },
  // --- FUTURE ---
  {
    id: '7',
    title: 'Image Ghost',
    era: 'Future',
    points: 350,
    description: 'This image from the future contains more than meets the eye. The message is encoded, but how?',
    longDescription: 'Moments pass like shadows, leaving traces only the sharp-eyed can see. Some are echoes of what has been, some are whispers of what is, and some are secrets yet to come. Can you uncover the hidden threads that tie them together?',
    hints: [
      { cost: 25, text: 'A folder holds pieces of time. Some are from the past, some from the present, and some are secrets of the future. Only by finding them all will you get the flags.' },
      
    ],
    flag: 'FLAG{Super Secret Message}',
  },
  {
    id: '9',
    title: 'Template Engine Probe',
    era: 'Future',
    points: 300,
    description: 'A small form reflects your input using the server-side template engine. Can you craft input that makes the server reveal its secret?',
    longDescription: 'Some template engines evaluate expressions when rendering pages. If user input is embedded directly into a template without proper escaping, it can lead to Server-Side Template Injection (SSTI). Submit a payload that causes the server to render the secret value.',
    simulation: 'ssti',
    hints: [
      { cost: 0, text: 'Try submitting simple expressions first, then increase complexity.' },
      { cost: 25, text: 'Common payloads differ between engines (e.g., Jinja2, Twig, Mustache). Start with something that echoes the input.' },
      { cost: 50, text: 'If the server evaluates expressions, try retrieving environment or configuration values.' },
    ],
    flag: 'FLAG{S3RV3R_GOT_H4CK3D}',
  },
];

