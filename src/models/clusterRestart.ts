import { ClusterApi } from "@/services/cluster";
import { useSetState, useRequest, useMount, useLocalStorageState } from "ahooks";
// import { getUser } from "@/services/user";
const useClusterRestart =
  () => {
    /**start */
    const { loading: onlineLoading, runAsync: onlineClusterNode } = useRequest(ClusterApi.onlineClusterNode, {
      manual: true,
      onSuccess: (res, params) => {
        if (res.isSuccess) {
          savehideMsg(params)

        }
      },
    });

    /**stop */
    const { loading: offlineLoading, runAsync: offlineClusterNode } = useRequest(
      ClusterApi.offlineClusterNode,
      {
        manual: true,
      },
    );
    /**delete */
    const { loading: deleteLoading, runAsync: deleteClusterNode } = useRequest(
      ClusterApi.deleteClusterNode,
      {
        manual: true,
      },
    );

    const [hiddenMsg, setMessage] = useLocalStorageState(
      'hiddenMsg',
    );
    const [state, setState] = useSetState({
      hiddenMsgOpen: false
    })

    useMount(() => {
      try {
        if (hiddenMsg) {
          setState({
            hiddenMsgOpen: true
          })
        }
      } catch (error) {
        console.log(error);
      }
    })

    function savehideMsg(msg) {
      setMessage(msg)
      setState({
        hiddenMsgOpen: true
      })
    }

    const clearHideMsg = () => {
      setMessage({})
      setState({
        hiddenMsgOpen: false
      })
    }




    const loadingEffects = {
      onlineClusterNode: onlineLoading,
      offlineClusterNode: offlineLoading
    }

    const modelState = { ...state, loadingEffects }
    const modelFn = { setState, onlineClusterNode, deleteClusterNode, offlineClusterNode, clearHideMsg }

    return [modelState, modelFn] as [typeof modelState, typeof modelFn]
  };
export default useClusterRestart