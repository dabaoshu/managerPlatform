import { ClusterApi } from "@/services/cluster";
import { useSetState, useRequest } from "ahooks";
// import { getUser } from "@/services/user";
const useClusterModel =
  () => {
    const [state, setState] = useSetState({
      clusterList: [],
      currentCluster: undefined
    })
    const { loading: getClusterLoading, runAsync: getCluster } = useRequest(ClusterApi.getCluster, {
      manual: true,
    })
    // const getClusterLoading = false
    // const getCluster = false
    const loadingEffects = {
      getCluster: getClusterLoading
    }

    const modelState = { ...state, loadingEffects }
    const modelFn = { setState, getCluster }

    return [modelState, modelFn] as [typeof modelState, typeof modelFn]
  };
export default useClusterModel