import logo from "./logo.svg";
import "./App.css";
import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
  useQuery,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://48p1r2roz4.sse.codesandbox.io",
  cache: new InMemoryCache(),
});

function Page() {
  const controller = new window.AbortController();
  const { data, loading, refetch } = useQuery(
    gql`
      query GetRates {
        rates(currency: "USD") {
          currency
        }
      }
    `,
    {
      context: { fetchOptions: { signal: controller.signal } },
    }
  );

  // This aborts the above request
  // controller.abort();

  const fakeMutation = async () => {
    if (loading) {
      // we're currently loading some data which the below mutation could
      // change... abort the load, mutate, then refetch
      controller.abort();
    }

    // mutate

    await refetch();
  };

  return (
    <div className="App">
      <button onClick={() => fakeMutation()}>Fake mutation</button>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Page />
    </ApolloProvider>
  );
}

export default App;
