import { ReactNode, useCallback, useEffect, useState } from "react";

import Loader from "components/Loader";

import { logout } from "helpers/logout";
import { useRenderStatus } from "helpers/useRenderStatus";
import useAuthStore from "store/AuthStore";

import { RouteType } from "types";
import useTopicStore from "store/TopicStore";
import { useNavigate, useParams } from "react-router-dom";
import { routePaths, topicSlugParam } from "routes/constants";
import { useActivePage } from "hooks/useActivePage";

interface TopicRouteProps {
  route: RouteType;
  children: ReactNode;
}

const TopicRoute = ({  children }: TopicRouteProps) => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const {[topicSlugParam]:topicSlug} = useParams()
  const topics = useTopicStore(state=>state.topics)
  const isLoading = useTopicStore(state=>state.isLoading)
  const onSetSelectedTopic = useTopicStore(state=>state.onSetSelectedTopic)
  const navigate = useNavigate()
  const { activeRouteParentName} =   useActivePage()

  useEffect(()=>{
    if(!isLogin  || isLoading) return
    if(activeRouteParentName === routePaths.root.topic._name){
      console.log('topicSlug',topicSlug)
      console.log('topics',topics)
      const selected = topics.find(topic=>topic.id === Number(topicSlug))
      if(selected){
        onSetSelectedTopic(selected)
      }else{
        navigate(routePaths.root.root)
      }
    }else{
      onSetSelectedTopic(undefined)
    }
  },[activeRouteParentName, isLoading, isLogin, navigate, onSetSelectedTopic, topicSlug, topics])

  return <>{children}</>;
};

export default TopicRoute;
