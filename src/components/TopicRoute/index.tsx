import { ReactNode, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useActivePage } from "hooks/useActivePage";
import useAuthStore from "store/AuthStore";
import useTopicStore from "store/TopicStore";

import { RouteType } from "types";
import { routePaths, topicSlugParam } from "routes/constants";

interface TopicRouteProps {
  route: RouteType;
  children: ReactNode;
}

const TopicRoute = ({ children }: TopicRouteProps) => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const { [topicSlugParam]: topicSlug } = useParams();
  const topics = useTopicStore((state) => state.topics);
  const onSetSelectedTopic = useTopicStore((state) => state.onSetSelectedTopic);
  const navigate = useNavigate();
  const { activeRouteParentName } = useActivePage();

  useEffect(() => {
    if (!isLogin || !topics.length) return;
    if (activeRouteParentName === routePaths.root.topic._name) {
      console.log("topicSlug", topicSlug);
      console.log("topics", topics);
      const selected = topics.find((topic) => String(topic.id) === topicSlug);
      console.log("selected", selected);
      if (selected) {
        onSetSelectedTopic(selected);
      } else {
        navigate(routePaths.root.root);
      }
    } else {
      onSetSelectedTopic(undefined);
    }
  }, [
    activeRouteParentName,
    isLogin,
    navigate,
    onSetSelectedTopic,
    topicSlug,
    topics,
  ]);

  return <>{children}</>;
};

export default TopicRoute;
