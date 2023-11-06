import { ClusterApi } from "@/services/cluster";
import { useSetState, useRequest, useLocalStorageState } from "ahooks";
// import { getUser } from "@/services/user";

type CurrentCluster = {
  ckTcpPort: number;
  httpPort: number;
  rpcPort: number;
  exchPort: number;
  exStatPort: number;
  tsoPort: number;
  rmPort: number;
  dmPort: number;
  clusterName: string;
  packageVersion: string;
  path: string;
  c: string;
}

const useClusterModel =
  () => {
    const [appCluster, setAppCluster] = useLocalStorageState<CurrentCluster>("app-cluster")
    const [state, setState] = useSetState<{ clusterInfoList: { clusterConfig?: CurrentCluster, [key: string]: any }, clusterList: CurrentCluster[], currentCluster: Partial<CurrentCluster>, }>({
      clusterList: [],//就集群基础信息
      clusterInfoList: [],//全信息
      currentCluster: {},
    })
    const { loading: getClusterLoading, runAsync: getCluster, } = useRequest(ClusterApi.getCluster, {
      manual: true,
    })
    // const getClusterLoading = false
    // const getCluster = false
    const loadingEffects = {
      getCluster: getClusterLoading
    }

    const switchCluster = (cluster: CurrentCluster) => {
      setState({
        currentCluster: cluster
      })
    }

    const modelState = { ...state, loadingEffects, appCluster }
    const modelFn = { setState, getCluster, switchCluster, setAppCluster }



    return [modelState, modelFn] as [typeof modelState, typeof modelFn]
  };
export default useClusterModel