import { useQuery } from "react-query";

import Spinner from "components/Spinner";

import { queryGetAIModels } from "api/ai-models";
import cn from "lib/cn";
import useAIModelStore from "store/AIModel";
import useAuthStore from "store/AuthStore";

const AIModelPicker = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const onSetAIModels = useAIModelStore((state) => state.onSetAIModels);
  const onSetSelectedAIModel = useAIModelStore(
    (state) => state.onSetSelectedAIModel
  );
  const selectedAIModel = useAIModelStore((state) => state.selectedAIModel);

  const { isLoading: isLoadingGetAIModels } = useQuery(
    queryGetAIModels._key,
    queryGetAIModels,
    {
      enabled: isLogin,
      onError: () => {
        onSetSelectedAIModel(null);
      },
      onSuccess: (data) => {
        onSetAIModels(data);
        onSetSelectedAIModel(data[0]);
      },
    }
  );

  if (!selectedAIModel?.modelName) return null;

  return (
    <div
      className={cn(
        "py-3 px-6 text-foreground-300 font-semibold text-lg border rounded-full flex"
      )}
    >
      <p>
        {" "}
        {isLoadingGetAIModels ? (
          <Spinner className="w-7 h-7 mx-4" />
        ) : (
          selectedAIModel?.modelName
        )}
      </p>
    </div>
  );
};

export default AIModelPicker;
