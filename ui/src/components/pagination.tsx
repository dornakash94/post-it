import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";

interface PaginationComponentProps<Result> {
  pageSize: number;
  fetchPage: (pageNumber: number, pageSize: number) => Promise<Result[]>;
  render: (results: Result[]) => JSX.Element;
}

function PaginationComponent<Result>({
  pageSize,
  fetchPage,
  render,
}: PaginationComponentProps<Result>) {
  const [state, setState] = useState({
    pageNumber: 0 as number,
    allResults: [] as Result[],
    loading: false,
  });

  const { pageNumber, allResults } = state;

  //   const allResult: Result[] = [];
  const fetch = () => {
    setState({ ...state, loading: true });
    fetchPage(pageNumber, pageSize).then((results) => {
      setTimeout(() => {
        setState({
          ...state,
          pageNumber: pageNumber + 1,
          allResults: [...allResults, ...results],
          loading: false,
        });
      }, 2000);
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  const onScrollButton = () => {
    const expected = pageNumber * pageSize;

    if (expected === allResults.length) {
      fetch();
    }
  };

  const renderLoader = () => {
    return <Spinner animation="grow" />;
  };

  const ready = !(state.loading && allResults.length == 0);

  return (
    <div>
      {ready && render(allResults)}
      {!state.loading && <Button onClick={onScrollButton}>fetch more</Button>}
      {state.loading && renderLoader()}
    </div>
  );
}

export default PaginationComponent;
