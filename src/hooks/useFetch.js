import { useState, useEffect } from 'react';
import { API } from 'aws-amplify';

const useFetch = (endpointName, path, initialData) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(null);
      setIsLoading(true);
      try {
        const response = await API.get(endpointName, path);
        setData(response);
      } catch (error) {
        setIsError(error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [endpointName, path]);

  return [{ data, isLoading, isError }, setData];
};

export default useFetch;
