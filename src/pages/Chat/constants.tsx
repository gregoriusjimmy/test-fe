import { ChatGPTLogoSVG, Claude3AILogo } from "components/assets";

import { EAIModelId } from "api/ai-models/types";

export const ID_AI_MODEL_LOGO_MAP = {
  [EAIModelId.CHATGPT40]: <ChatGPTLogoSVG className="w-7 h-7" />,
  [EAIModelId["CLAUDE3.5SONNET"]]: <Claude3AILogo className="w-7 h-7" />,
};
