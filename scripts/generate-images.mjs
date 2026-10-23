// Generates the homepage photography with the OpenAI Images API.
// Run from web/: node --env-file=../.env.local scripts/generate-images.mjs [name ...]
// Existing files are skipped; delete one (or pass its name) to regenerate it.
import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";

const OUT = "public/images";
const MODELS = ["gpt-image-1.5", "gpt-image-1"];

const PHOTO =
  "Photorealistic editorial photograph, premium ride-hailing brand campaign, natural skin tones, shallow depth of field, shot on a full-frame camera, no text, no logos, no watermarks.";
const CITY =
  "Photorealistic wide cityscape photograph, skyline only, no people, no cars in the foreground, no text, no logos, no watermarks.";
const VEHICLE =
  "Studio product photograph on a pure white seamless background, three-quarter front view facing right, soft contact shadow, entire vehicle in frame with generous margin, unbranded, no badges, no text, no license plate text.";

const images = {
  hero: ["1536x1024", 1920, `${PHOTO} A confident Black woman in a tailored dark blazer and sunglasses stands beside a glossy black executive sedan, holding a smartphone, golden-hour sunset behind a modern West African city skyline with glass towers. Subject positioned right of centre, cinematic warm light, dark moody left side with open space.`],
  experience: ["1536x1024", 1920, `${PHOTO} A serene Black woman sits in the back seat of a car looking out the window at sunlit city towers, warm afternoon light streaming in, contemplative and calm. Subject on the right half of the frame, soft bright window on the left.`],
  "car-go": ["1536x1024", 1400, `${VEHICLE} A white modern compact four-door sedan.`],
  "car-plus": ["1536x1024", 1400, `${VEHICLE} A black modern mid-size four-door sedan.`],
  "car-xl": ["1536x1024", 1400, `${VEHICLE} A black modern seven-seat SUV.`],
  "car-lux": ["1536x1024", 1400, `${VEHICLE} A black luxury executive full-size sedan.`],
  "car-moto": ["1536x1024", 1400, `${VEHICLE} A blue and black standard street motorcycle.`],
  "car-assist": ["1536x1024", 1400, `${VEHICLE} A white modern wheelchair-accessible passenger van with a side sliding door.`],
  "journey-airport": ["1024x1536", 900, `${PHOTO} A modern passenger jet parked at a contemporary airport terminal on a bright clear day, city skyline in the distance.`],
  "journey-city": ["1024x1536", 900, `${PHOTO} A stylish Black woman wearing sunglasses sits in the back seat of a car, city buildings outside the window, daytime.`],
  "journey-intercity": ["1024x1536", 900, `${PHOTO} A winding highway through lush green hills and mountains at golden hour, aerial perspective, sense of travel between cities.`],
  "journey-hourly": ["1024x1536", 900, `${PHOTO} A Black businessman in a dark suit works on a tablet in the back seat of a car, city outside the window.`],
  "journey-scheduled": ["1024x1536", 900, `${PHOTO} Close-up of a hand holding a smartphone inside a car at dusk, the screen softly glowing and out of focus, warm interior light.`],
  "phone-hand": ["1024x1536", 900, `${PHOTO} Close-up of a hand holding a smartphone in a car at night, the screen showing a blurred blue navigation map with a route line, city lights bokeh outside.`],
  "avatar-daniel": ["1024x1024", 256, `${PHOTO} Head-and-shoulders portrait of a smiling Black man in his thirties wearing a dark polo shirt, plain light grey background.`],
  driver: ["1536x1024", 1600, `${PHOTO} A smiling Black male driver in a black polo shirt leans against his car holding a smartphone, friendly and confident, sunny city street with towers behind. Subject on the right half of the frame.`],
  "drive-hero": ["1536x1024", 1920, `${PHOTO} A smiling Black male driver in his thirties wearing a plain black cap and black polo shirt sits behind the steering wheel of a modern car, seatbelt on, warm daylight through the windows, blurred city towers outside. Subject right of centre facing the camera, darker open space on the left.`],
  "business-hero": ["1536x1024", 1920, `${PHOTO} A confident Black businesswoman in a dark blazer works on a laptop at a desk in a modern high-rise office, city towers through floor-to-ceiling windows behind her, cool restrained daylight. Subject in the centre-left of the frame, darker moody tones overall.`],
  "business-events": ["1024x1536", 900, `${PHOTO} A group of well-dressed Black professionals arrive at a modern conference venue at dusk, warm entrance lights, a black sedan at the kerb.`],
  "fleet-hero": ["1536x1024", 1920, `${PHOTO} A Black male fleet manager in a dark navy jacket checks a tablet while standing in a large outdoor parking lot with rows of identical dark sedans, modern city towers behind, overcast daylight. Subject centre-left, panoramic composition.`],
  business: ["1536x1024", 1600, `${PHOTO} A professional Black woman in a beige blazer sits in the back seat of a premium car, looking out the window at office towers, bright daylight. Subject on the right half of the frame.`],
  fleet: ["1536x1024", 1600, `${PHOTO} A neat row of identical black sedans parked in front of a modern glass office building on a bright day, fleet operations, clean and orderly.`],
  final: ["1536x1024", 1920, `${PHOTO} A glossy black executive sedan drives across a city bridge at dusk, illuminated modern skyline and lights reflecting, deep blue and amber tones, wide cinematic composition with dark sky.`],
  "safety-map": ["1536x1024", 1600, "Minimal dark navy stylized top-down city street map illustration, subtle thin lighter-blue roads and blocks, no labels, no text, no markers, flat vector style."],
  "map-us": ["1536x1024", 800, "Minimal flat illustration of a map of the United States in pale light blue with subtle thin state borders on a white background, no labels, no text, no markers."],
  "city-lagos": ["1536x1024", 600, `${CITY} Lagos Nigeria skyline with modern towers and lagoon on a clear day.`],
  "city-abuja": ["1536x1024", 600, `${CITY} Abuja Nigeria city skyline with modern buildings and green hills on a clear day.`],
  "city-ibadan": ["1536x1024", 600, `${CITY} Ibadan Nigeria cityscape with a tall tower and dense rooftops at golden hour.`],
  "city-more": ["1536x1024", 600, `${CITY} A modern city skyline at blue hour with lights coming on.`],
};

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is missing. Run with --env-file=../.env.local");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
const todo = Object.entries(images).filter(([name]) =>
  only.length ? only.includes(name) : !existsSync(`${OUT}/${name}.webp`),
);

let model = MODELS[0];

async function generate(prompt, size) {
  for (;;) {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, prompt, size, quality: "high", n: 1 }),
    });
    const body = await res.json();
    if (res.ok) return Buffer.from(body.data[0].b64_json, "base64");
    const message = body.error?.message ?? res.statusText;
    const next = MODELS[MODELS.indexOf(model) + 1];
    if (next && /model/i.test(message)) {
      console.log(`${model} unavailable (${message}); falling back to ${next}`);
      model = next;
      continue;
    }
    throw new Error(`${res.status}: ${message}`);
  }
}

async function run([name, [size, width, prompt]]) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const png = await generate(prompt, size);
      await sharp(png).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${OUT}/${name}.webp`);
      console.log(`ok ${name}`);
      return;
    } catch (err) {
      // Network drops surface as "fetch failed"; API errors carry a status and are not retried.
      const retryable = err.message === "fetch failed" || /^(429|5\d\d):/.test(err.message);
      if (!retryable || attempt === 4) {
        console.log(`FAILED ${name}: ${err.message}`);
        return;
      }
      console.log(`retry ${name} (${err.message})`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 5000));
    }
  }
}

console.log(`generating ${todo.length} images`);
for (let i = 0; i < todo.length; i += 3) {
  await Promise.all(todo.slice(i, i + 3).map(run));
}
console.log("done");
