import { useCallback, useEffect, useState } from "react";
import { server } from "./server";

const ns = "api/useQuery";

interface State<TData> {
  data: TData | null;
  loading: boolean;
  error: boolean;
}

export const useQuery = <TData = any>(query: string) => {
  const [ state, setState ] = useState<State<TData>>({
    data: null, loading: false, error: false
  });

  const fetch = useCallback(() => {
    const fetchApi = async () => {
      try {
        setState({ data: null, loading: true, error: false });
        const { data, errors } = await server.fetch<TData>({ query });

        if (errors && errors.length) {
          throw new Error(`${ns} fetch returned with error "${errors[0].message}"`)
        }

        setState({ data, loading: false, error: false})
      }
      catch(error) {
        setState({ data: null, loading: false, error: true });
        console.error(error);
      }
    };

    fetchApi();

  }, [query]);

  useEffect(() => {
    fetch();
  }, [fetch])

  return { ...state, refetch: fetch };
};
