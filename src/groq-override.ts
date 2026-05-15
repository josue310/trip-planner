const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const FALLBACK_MODEL = "llama-3.1-8b-instant";
const getModel = () => (import.meta.env.VITE_GROQ_MODEL || FALLBACK_MODEL);
const isUnsupportedModel = (model: string) =>
  /prompt-guard|llama-guard|safeguard|llama-3\.1-70b|llama-3\.3-70b.*versatile/i.test(model);

const originalFetch = window.fetch.bind(window);

window.fetch = async (input: RequestInfo, init?: RequestInit) => {
  try {
    const url = typeof input === "string" ? input : input.url;
    if (url && url.indexOf(GROQ_URL) !== -1) {
      // clone/modify request init
      const newInit: RequestInit = Object.assign({}, init || {});
      if (newInit.body) {
        try {
          let bodyText: string;
          if (typeof newInit.body === "string") bodyText = newInit.body;
          else if (newInit.body instanceof URLSearchParams) bodyText = newInit.body.toString();
          else if (newInit.body instanceof FormData) {
            // not expected, skip
            bodyText = null as any;
          } else if ((newInit.body as any) instanceof Blob) {
            bodyText = null as any;
          } else {
            // assume it's already a stringifiable object
            bodyText = JSON.stringify(newInit.body);
          }
          if (bodyText) {
            const parsed = JSON.parse(bodyText);
            if (parsed.model && isUnsupportedModel(parsed.model)) {
              parsed.model = getModel();
              if (isUnsupportedModel(parsed.model)) parsed.model = FALLBACK_MODEL;
              newInit.body = JSON.stringify(parsed);
              if (newInit.headers) {
                if (newInit.headers instanceof Headers) {
                  newInit.headers.set("Content-Type", "application/json");
                } else if (Array.isArray(newInit.headers)) {
                  const headers = new Headers(newInit.headers as any);
                  headers.set("Content-Type", "application/json");
                  newInit.headers = headers;
                } else {
                  (newInit.headers as any)["Content-Type"] = "application/json";
                }
              } else {
                newInit.headers = { "Content-Type": "application/json" };
              }
            }
          }
        } catch (e) {
          // if parsing fails, fall through and let original request proceed
          console.warn("groq-override: failed to parse request body", e);
        }
      }
      return originalFetch(input, newInit);
    }
  } catch (e) {
    console.warn("groq-override: error in fetch wrapper", e);
  }
  return originalFetch(input, init);
};
