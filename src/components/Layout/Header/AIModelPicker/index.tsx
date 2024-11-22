import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

import Spinner from "components/Spinner";

import { queryGetAIModels } from "api/ai-models";
import { useOutsideClick } from "hooks/useOutsideClick";
import cn from "lib/cn";
import { useQueryWithCallbacks } from "lib/react-query";
import useAIModelStore from "store/AIModel";
import useAuthStore from "store/AuthStore";

import { TAIModel } from "api/ai-models/types";
import { routePaths } from "routes/constants";

const AIModelPicker = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const isLogin = useAuthStore((state) => state.isLogin);
  const onSetAIModels = useAIModelStore((state) => state.onSetAIModels);
  const onSetSelectedAIModel = useAIModelStore(
    (state) => state.onSetSelectedAIModel
  );
  const selectedAIModel = useAIModelStore((state) => state.selectedAIModel);
  const refMenu = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useOutsideClick(refMenu, () => {
    setOpenDropdown(false);
  });
  const { isLoading: isLoadingGetAIModels, data } = useQueryWithCallbacks({
    queryKey: queryGetAIModels._key,
    queryFn: queryGetAIModels,
    enabled: isLogin,
    onError: () => {
      onSetSelectedAIModel(null);
    },
    onSuccess: (data) => {
      onSetAIModels(data);
      onSetSelectedAIModel(data[0]);
    },
  });

  const onClickMenu = () => {
    setOpenDropdown((prev) => !prev);
  };

  const handleClickSelectModel = (model: TAIModel) => {
    onSetSelectedAIModel(model);
    navigate(routePaths.root.root);
  };

  if (!selectedAIModel?.modelName) return null;

  return (
    <div
      ref={refMenu}
      onClick={onClickMenu}
      className={cn(
        "py-3 px-6 text-foreground-300 font-semibold text-lg border rounded-full flex items-center relative",
        data?.length && "cursor-pointer"
      )}
    >
      <p className="mr-4">
        {isLoadingGetAIModels ? (
          <Spinner className="w-7 h-7 mx-4" />
        ) : (
          selectedAIModel?.modelName
        )}
      </p>
      {data?.length &&
        (openDropdown ? (
          <ChevronUp className="w-6 h-6 text-foreground-200" />
        ) : (
          <ChevronDown className="w-6 h-6 text-foreground-200" />
        ))}
      {openDropdown && (
        <div className="flex shadow-sm z-[99] flex-col py-1 absolute bg-background-800 border top-[4rem] right-0 border-foreground-300 rounded-xl overflow-hidden">
          {data
            ?.filter((model) => model.id !== selectedAIModel.id)
            .map((model) => (
              <div
                onClick={() => handleClickSelectModel(model)}
                className="flex py-2 w-full whitespace-pre px-4 cursor-pointer bg-background-800 transition-colors hover:bg-background-600 text-foreground-100"
                key={model.id}
              >
                {model.modelName}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AIModelPicker;
