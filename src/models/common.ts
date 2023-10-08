import type { Effect, Reducer } from 'umi';
import { BASE_URL_OLD, LOCAL_STORAGE } from '@/constants';



export interface CommonModelType {
  namespace: string;
  state: any;
  effects: {
    // getAllClusters: Effect;
    // getServices: Effect;
  };
  reducers: {
    // clear: Reducer<CommonModelState>;
    // save: Reducer<CommonModelState>;
  };
}



const defaultState = {
  clusterList: [],
  currentServiceList: [],
};

const namespace = 'common';
const CommonModel: CommonModelType = {
  namespace: namespace,
  state: { ...defaultState },
  effects: {

  },
  reducers: {
    clear(state) {
      return {
        ...state,
        ...defaultState,
      };
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default CommonModel;
