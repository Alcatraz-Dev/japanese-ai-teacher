import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // هذا هو الإفتراضي ويمكن تجاهله
});

const formalExample = {
  japanese: [
    { word: "日本", reading: "にほん" },
    { word: "に" },
    { word: "住んで", reading: "すんで" },
    { word: "います" },
    { word: "か" },
    { word: "؟" },
  ],
  grammarBreakdown: [
    {
      arabic: "هل تعيش في اليابان؟",
      japanese: [
        { word: "日本", reading: "にほん" },
        { word: "に" },
        { word: "住んで", reading: "すんで" },
        { word: "います" },
        { word: "か" },
        { word: "؟" },
      ],
      chunks: [
        {
          japanese: [{ word: "日本", reading: "にほん" }],
          meaning: "اليابان",
          grammar: "اسم",
        },
        {
          japanese: [{ word: "に" }],
          meaning: "في",
          grammar: "حرف جر",
        },
        {
          japanese: [{ word: "住んで", reading: "すんで" }, { word: "います" }],
          meaning: "يعيش",
          grammar: "فعل + شكل الـتي + ます",
        },
        {
          japanese: [{ word: "か" }],
          meaning: "سؤال",
          grammar: "حرف جر",
        },
        {
          japanese: [{ word: "؟" }],
          meaning: "سؤال",
          grammar: "علامة ترقيم",
        },
      ],
    },
  ],
};

const casualExample = {
  japanese: [
    { word: "日本", reading: "にほん" },
    { word: "に" },
    { word: "住んで", reading: "すんで" },
    { word: "いる" },
    { word: "の" },
    { word: "؟" },
  ],
  grammarBreakdown: [
    {
      arabic: "هل تعيش في اليابان؟",
      japanese: [
        { word: "日本", reading: "にほん" },
        { word: "に" },
        { word: "住んで", reading: "すんで" },
        { word: "いる" },
        { word: "の" },
        { word: "؟" },
      ],
      chunks: [
        {
          japanese: [{ word: "日本", reading: "にほん" }],
          meaning: "اليابان",
          grammar: "اسم",
        },
        {
          japanese: [{ word: "に" }],
          meaning: "في",
          grammar: "حرف جر",
        },
        {
          japanese: [{ word: "住んで", reading: "すんで" }, { word: "いる" }],
          meaning: "يعيش",
          grammar: "فعل + شكل الـتي + いる",
        },
        {
          japanese: [{ word: "の" }],
          meaning: "سؤال",
          grammar: "حرف جر",
        },
        {
          japanese: [{ word: "؟" }],
          meaning: "سؤال",
          grammar: "علامة ترقيم",
        },
      ],
    },
  ],
};

export async function GET(req) {

  const speech = req.nextUrl.searchParams.get("speech") || "formal";
  const speechExample = speech === "formal" ? formalExample : casualExample;

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `أنت معلم لغة يابانية.
        طالبك يسألك كيف تقول شيئًا من العربية إلى اليابانية.
        يجب عليك الرد بـ:
        - العربية: النسخة العربية مثل: "${speechExample.arabic}"
        - اليابانية: الترجمة اليابانية مقسمة إلى كلمات مثل: ${JSON.stringify(
          speechExample.japanese
        )}
        - تحليل القواعد النحوية: شرح لهيكل القواعد لكل جملة مثل: ${JSON.stringify(
          speechExample.grammarBreakdown
        )}
`,
      },
      {
        role: "system",
        content: `عليك دائمًا الرد بكائن JSON بالتنسيق التالي:
        {
          "arabic": "",
          "japanese": [{
            "word": "",
            "reading": ""
          }],
          "grammarBreakdown": [{
            "arabic": "",
            "japanese": [{
              "word": "",
              "reading": ""
            }],
            "chunks": [{
              "japanese": [{
                "word": "",
                "reading": ""
              }],
              "meaning": "",
              "grammar": ""
            }]
          }]
        }`,
      },
      {
        role: "user",
        content: `كيف تقول ${
          req.nextUrl.searchParams.get("question") ||
          "هل سبق لك أن زرت اليابان؟"
        } باللغة اليابانية بأسلوب ${speech}؟`,
      },
    ],
    // model: "gpt-4-turbo-preview", // https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
    model: "gpt-3.5-turbo", // https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4
    response_format: {
      type: "json_object",
    },
  });
  console.log(chatCompletion.choices[0].message.content);
  return Response.json(JSON.parse(chatCompletion.choices[0].message.content));
}
