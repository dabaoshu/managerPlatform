import useSetState from "../useSetState"

export const useLoadings = () => {
  const [loadings, setLoading] = useSetState({})
  const setLoadingState = (key: string, loading: boolean) => {
    setLoading({
      ...loadings,
      [key]: loading
    })
  }
  const openLoading = (key: string) => setLoadingState(key, true)
  const closeLoading = (key: string) => setLoadingState(key, false)
  return { loadings, openLoading, closeLoading, setLoadingState }
}