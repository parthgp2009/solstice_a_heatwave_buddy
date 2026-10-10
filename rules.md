# Rules for the AI agent

- Stack: Next.js (App Router), TypeScript, Tailwind CSS, Supabase (database + auth), Amazon Polly (@aws-sdk/client-polly).
- Never hardcode secrets or keys. Use environment variables in .env.local only.
- AWS environment variables must use the prefix `MY_` (MY_AWS_ACCESS_KEY_ID, MY_AWS_SECRET_ACCESS_KEY, MY_AWS_REGION) because Netlify does not allow variables starting with `AWS_`.
- AWS credentials and the Supabase service_role key must NEVER reach the browser or frontend code.
- Amazon Polly calls must only happen in a server-side Next.js API route (e.g., app/api/speak/route.ts).
- AWS IAM permissions: only grant `polly:SynthesizeSpeech`.
- Voice: Use the Kajal voice (Neural engine, bilingual for hi-IN and en-IN). If Polly fails or is unavailable, fall back to the browser's Web Speech API (speechSynthesis).
- Audio route safety: Accept max ~1500 characters, return audio/mpeg (mp3), and apply rate limiting to prevent unnecessary AWS costs.
- "Listen" button must be user-triggered only (never auto-play), show a loading state, and include a stop button.
- Every database table must have Row Level Security enabled with policies.
- Validate all user input.
- Make small changes. Do one phase at a time and stop when it is done.
- Do not open the browser to verify. I will test myself and tell you the result.
- If something fails twice, stop and tell me what is wrong instead of retrying.
- Explain new files in simple words, I am a beginner.

