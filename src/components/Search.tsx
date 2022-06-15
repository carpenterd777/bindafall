import Link from "next/link";
import {
  ChangeEventHandler,
  FC,
  FocusEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";

// ref: https://medium.com/@matswainson/building-a-search-component-for-your-next-js-markdown-blog-9e75e0e7d210
const Search: FC = () => {
  const searchRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(false);
  const [results, setResults] = useState<
    Array<{ id: number; name: string; route_name: string }>
  >([]);

  const searchEndpoint = (query: string) => `/api/search?name=${query}`;

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async event => {
      const query = (event.target as HTMLInputElement).value;
      setQuery(query);
      if (query.length) {
        const res = await fetch(searchEndpoint(query));
        const json = (await res.json()) as {
          results:
            | Array<{ id: number; name: string; route_name: string }>
            | undefined;
          error: string | undefined;
        };
        if (json.results) {
          setResults(json.results);
        }
      } else {
        setResults([]);
      }
    },
    []
  );

  const onFocus = useCallback<FocusEventHandler<HTMLInputElement>>(() => {
    setActive(true);
    window.addEventListener<"click">("click", onClick);
  }, []);

  const onClick = useCallback((event: MouseEvent) => {
    if (
      searchRef.current &&
      event.target !== null &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setActive(false);
      window.removeEventListener<"click">("click", onClick);
    }
  }, []);

  return (
    <div className="lg:my-auto mx-5" ref={searchRef}>
      <input
        className="text-white bg-slate-700 px-2 py-1 rounded-md w-60"
        onChange={onChange}
        onFocus={onFocus}
        placeholder={"Search for custom cards..."}
        type="text"
        value={query}
      />
      {active && results.length > 0 ? (
        <ul className="fixed z-20 w-60">
          {results.map(({ id, name, route_name }) => {
            return (
              <li className="bg-slate-700 border-t border-slate-400 py-1 px-2 font-bold text-white hover:bg-slate-500">
                <Link href="/card/[id]/[name]" as={`/card/${id}/${route_name}`}>
                  <a>{name}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default Search;
