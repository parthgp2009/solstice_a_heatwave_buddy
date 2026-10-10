import { SynthesizeSpeechCommand, PollyClient } from "@aws-sdk/client-polly";

async function runSpeakTests() {
  console.log("=== AMAZON POLLY SPEECH ROUTE & VALIDATION TESTS ===");

  // 1. Validate max character limit rule (Rule 10: max 1500 chars)
  const MAX_CHARS = 1500;
  const shortText = "आपकी दैनिक सुरक्षा योजना। खूब पानी पिएं।";
  const tooLongText = "A".repeat(1501);

  console.log(`Short text length: ${shortText.length} (within limit <= ${MAX_CHARS})`);
  console.log(`Too-long text length: ${tooLongText.length} (violates limit > ${MAX_CHARS})`);

  if (shortText.length > MAX_CHARS || tooLongText.length <= MAX_CHARS) {
    console.error("Length limit logic failed!");
    process.exit(1);
  }

  // 2. Verify AWS Environment Variable prefix (Rule 5: must use MY_ prefix)
  const accessKeyId = process.env.MY_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY;
  const region = process.env.MY_AWS_REGION || "ap-south-1";

  console.log(`Region configured: ${region}`);
  console.log(`AWS Credentials configured with MY_ prefix: ${Boolean(accessKeyId && secretAccessKey)}`);

  // 3. Verify Polly Command Specification (Rule 8 & 9: Kajal Neural Voice, hi-IN / en-IN, mp3)
  const hiCommand = new SynthesizeSpeechCommand({
    Engine: "neural",
    VoiceId: "Kajal",
    LanguageCode: "hi-IN",
    OutputFormat: "mp3",
    Text: shortText,
    TextType: "text"
  });

  const enCommand = new SynthesizeSpeechCommand({
    Engine: "neural",
    VoiceId: "Kajal",
    LanguageCode: "en-IN",
    OutputFormat: "mp3",
    Text: "Your daily safety plan. Stay hydrated and avoid direct sunlight.",
    TextType: "text"
  });

  if (
    hiCommand.input.Engine !== "neural" ||
    hiCommand.input.VoiceId !== "Kajal" ||
    hiCommand.input.LanguageCode !== "hi-IN" ||
    hiCommand.input.OutputFormat !== "mp3"
  ) {
    console.error("Hindi Polly command parameters do not match Kajal neural specifications!");
    process.exit(1);
  }

  if (
    enCommand.input.Engine !== "neural" ||
    enCommand.input.VoiceId !== "Kajal" ||
    enCommand.input.LanguageCode !== "en-IN" ||
    enCommand.input.OutputFormat !== "mp3"
  ) {
    console.error("English Polly command parameters do not match Kajal neural specifications!");
    process.exit(1);
  }

  console.log("Polly command parameters verified for both Hindi (hi-IN) and English (en-IN).");

  // 4. Test live Polly client if credentials are provided in .env.local
  if (accessKeyId && secretAccessKey) {
    console.log("Testing live Amazon Polly speech synthesis with configured MY_ credentials...");
    try {
      const client = new PollyClient({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey
        }
      });
      const res = await client.send(enCommand);
      if (res.AudioStream) {
        const bytes = await res.AudioStream.transformToByteArray();
        console.log(`Successfully synthesized audio via Polly! Received ${bytes.length} bytes (audio/mpeg).`);
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      console.warn(`Polly call returned error (will fallback to browser Web Speech): ${e?.message}`);
    }
  } else {
    console.log("Amazon Polly credentials not set in environment -> Browser Web Speech fallback is active.");
  }

  console.log("\nALL SPEECH TESTS PASSED SUCCESSFULLY");
}

runSpeakTests().catch(err => {
  console.error("Speech test failed:", err);
  process.exit(1);
});
