import type { Challenge } from './types';

/**
 * Client-safe challenge metadata WITHOUT flags.
 * For server-side operations requiring flags, use challengesWithFlags from challenges-server.ts
 */
type ChallengeMetadata = Omit<Challenge, 'flag'>;

export const challenges: ChallengeMetadata[] = [
  // --- PAST ---
  {
    id: '1',
    title: 'Ancient Cipher',
    era: 'Past',
    points: 100,
    description: 'Decrypt a message encoded using the birth of digital time.',
    longDescription: 'Every cipher hides its origin, every clock remembers its first beat — seek the moment time was born, and let its pieces come together.',
    hints: [
      { cost: 0, text: 'In the realm of numbers, there exists a sacred count that began when the digital cosmos first drew breath. The sum of its very essence holds the key to unraveling what was woven.' },
      { cost: 10, text: 'The ancient scribes used addition to weave their secret, but to unravel it you must walk backward. Sum all digits in the cosmic timestamp, apply modulo 26, then subtract this sacred number from each letter to reveal the truth.' },
      { cost: 20, text: 'Unix epoch time holds the cipher key: add each digit together, mod 26 gives the shift. The cipher was made by adding this to each letter of the plain text - reverse it by subtracting to decode.' },
    ],
  },
  {
    id: '2',
    title: 'The Hidden Papyrus',
    era: 'Past',
    points: 100,
    description: 'Find the hidden message beneath the surface of this ancient digital scroll.',
    longDescription: 'The present is what you see — bright, alive, and constantly rewriting itself. But this moment isn\'t where time began. Long before the first flicker reached your screen, something older was etched beneath — silent, unseen, yet still pulsing with the rhythm of the first second. The past rarely speaks, but it leaves quiet fingerprints for those who learn to notice.\n\nWhat stands before you is only the surface of a longer story. The future waits for those who can read between moments — those who know how to turn time backward and listen to its earliest beat. Somewhere below, the truth still lingers… patiently, waiting to be found.',
    hints: [
      { cost: 0, text: 'The ancients knew that what the eye perceives is but a veil. Beneath the surface of all digital scrolls lies a hidden architecture, readable only to those who know the sacred incantations.' },
      { cost: 10, text: 'When the trinity is squared and multiplied by the sacred seven, then blessed with the four winds of earth, the divine chamber reveals itself among the great multitude of sixty-nine... but beware the false prophets who speak in jest.' },
      { cost: 20, text: 'The math points to sixty-seven, yet the wise know that ancient builders loved their tricks. When mathematics fails and Hindi laughter mocks your efforts, seek the answer to life, the universe, and everything.' },
    ],
  },
  {
    id: '3',
    title: 'Forbidden Path',
    era: 'Past',
    points: 150,
    description: 'Discover a hidden path by exploring the site root directory.',
    longDescription: 'Some paths are meant to be invisible, written only for eyes that wander where the world does not. A quiet list sleeps in the shadows of the site — the guide to what should stay hidden waits at the very root, and you might uncover a line never meant to be seen.',
    simulation: 'robots',
    hints: [
      { cost: 0, text: 'The mechanical servants of old required instructions. What sacred text guides their metallic steps through the digital realm?' },
      { cost: 10, text: 'The scroll speaks the language of \'txt\' and bears the name of those it commands. It dwells at the root of all things.' },
      { cost: 20, text: 'Sometimes the first forbidden path leads not to treasure, but to another riddle. When letters dance and transformation beckons, let some sleep while others awaken.' },
    ],
  },
  // --- PRESENT ---
  {
    id: '4',
    title: 'Library Database',
    era: 'Present',
    points: 200,
    description: 'Exploit a vulnerable user search system to reveal hidden data.',
    longDescription: 'This internal system allows searching for a user by their ID. The endpoint seems to be directly constructing a database query from the URL. Can you manipulate the query to bypass the original logic and reveal the system\'s hidden secret?',
    simulation: 'sqli',
    hints: [
      { cost: 0, text: 'First browse the books, then try clicking on one to see its details. Notice the URL pattern.' },
      { cost: 10, text: 'The book ID parameter in the URL might accept more than just numbers.' },
      { cost: 20, text: 'Try classic SQL injection payloads in the book ID parameter.' },
    ],
  },
  {
    id: '5',
    title: 'Cross-Site Scribe',
    era: 'Present',
    points: 250,
    description: 'Uncover a flag hidden in malicious JavaScript code.',
    longDescription: 'This comment board is supposed to display user messages. However, it seems to lack proper sanitization, allowing scripts to be saved and executed in the browsers of other users. There is a flag hidden in a script left by another user.',
    simulation: 'xss',
    extraData: {
      comment: 'Hey everyone, check out this cool trick! <script>alert("You found me! The flag is FLAG{XSS_STORE}");</script>',
    },
    hints: [
      { cost: 0, text: 'The page content is dynamic. Where could the flag be executing from?' },
      { cost: 20, text: 'If a site is vulnerable to stored XSS, any user can inject JavaScript. The flag is in an alert box. If you don\'t see it, your browser might be blocking it.' },
    ],
  },
  {
    id: '6',
    title: 'Domain Name Secrets',
    era: 'Present',
    points: 250,
    description: 'Some information isn\'t on the web, but in the infrastructure that supports it. Find the TXT record.',
    longDescription: 'The Domain Name System (DNS) can store more than just IP addresses. TXT records are used for various purposes, and sometimes they hold secrets. Find the TXT record for `ctf.encodepdeu.space` to get the flag.',
    simulation: 'dns',
    hints: [
      { cost: 0, text: 'You\'ll need a tool to look up DNS records. `nslookup` or `dig` are common command-line tools.' },
      { cost: 10, text: 'Try: `nslookup -type=TXT <domain>` or `dig TXT <domain>`' },
      { cost: 20, text: 'The domain name will be provided in the challenge description.' },
    ],
  },
  // --- FUTURE ---
  {
    id: '7',
    title: 'Image Ghost',
    era: 'Future',
    points: 350,
    description: 'Decode a hidden message extracted from a steganographic image.',
    longDescription: 'Moments pass like shadows, leaving traces only the sharp-eyed can see. Some are echoes of what has been, some are whispers of what is, and some are secrets yet to come. Can you uncover the hidden threads that tie them together?',
    hints: [
      { cost: 25, text: 'A folder holds pieces of time. Some are from the past, some from the present, and some are secrets of the future. Only by finding them all will you get the flags.' },
      
    ],
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
  },
];
